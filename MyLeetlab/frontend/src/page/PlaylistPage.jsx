import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { useProblemStore } from "../store/useProblemStore";
import {
    ArrowLeft,
    BookOpen,
    CheckCircle2,
    Circle,
    Loader,
    PencilIcon,
    Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import EditPlaylistModal from "../components/modals/EditPlaylistModal";

// ── helpers ────────────────────────────────────────────────────────────────

const DIFFICULTY_BADGE = {
    EASY:   { cls: "badge-success",  label: "Easy"   },
    MEDIUM: { cls: "badge-warning",  label: "Medium" },
    HARD:   { cls: "badge-error",    label: "Hard"   },
};

// ─────────────────────────────────────────────────────────────────────────────

const PlaylistPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        playlist,
        isFetchingPlaylist,
        fetchAPlaylist,
        removeProblemFromPlaylist,
        deleteAPlaylist,
    } = usePlaylistStore();

    const { solvedProblems, getSolvedProblemByUser } = useProblemStore();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [notFound, setNotFound] = useState(false);

    // ── fetch on mount ────────────────────────────────────────────────────

    useEffect(() => {
        if (!id) { setNotFound(true); return; }

        fetchAPlaylist(id).catch(() => setNotFound(true));
        getSolvedProblemByUser();
    }, [id]);

    // ── derived data ──────────────────────────────────────────────────────

    const problems = useMemo(() => playlist?.problem ?? [], [playlist]);

    const solvedIdSet = useMemo(
        () => new Set(solvedProblems.map((s) => s.problemId)),
        [solvedProblems]
    );

    const stats = useMemo(() => {
        const total  = problems.length;
        const solved = problems.filter((p) => solvedIdSet.has(p.problemId)).length;
        const easy   = problems.filter((p) => p.problem?.difficulty === "EASY").length;
        const medium = problems.filter((p) => p.problem?.difficulty === "MEDIUM").length;
        const hard   = problems.filter((p) => p.problem?.difficulty === "HARD").length;
        return { total, solved, easy, medium, hard };
    }, [problems, solvedIdSet]);

    // ── handlers ──────────────────────────────────────────────────────────

    const handleRemove = async (problemId) => {
        try {
            await removeProblemFromPlaylist(id, { problemIds: [problemId] });
            await fetchAPlaylist(id);
        } catch {
            toast.error("Failed to remove problem");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete this playlist? This cannot be undone.")) return;
        try {
            await deleteAPlaylist(id);
            toast.success("Playlist deleted");
            navigate("/profile");
        } catch {
            toast.error("Failed to delete playlist");
        }
    };

    // ── states ────────────────────────────────────────────────────────────

    if (notFound) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="text-xl font-semibold">Playlist not found</p>
                <button className="btn btn-primary" onClick={() => navigate("/profile")}>
                    Back to Profile
                </button>
            </div>
        );
    }

    if (isFetchingPlaylist || !playlist) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                <Loader className="w-8 h-8 animate-spin" />
                <span className="text-base-content/60">Loading playlist…</span>
            </div>
        );
    }

    // ── render ────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-base-200">
            <div className="container mx-auto max-w-4xl px-4 py-8">

                {/* ── Back nav ──────────────────────────────────────────── */}
                <button
                    className="btn btn-ghost btn-sm gap-2 mb-6"
                    onClick={() => navigate("/profile")}
                    aria-label="Back to profile"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Profile
                </button>

                {/* ── Header card ───────────────────────────────────────── */}
                <div className="card bg-base-100 shadow-md p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex items-start gap-3 min-w-0">
                            <BookOpen className="w-6 h-6 text-primary mt-1 shrink-0" />
                            <div className="min-w-0">
                                <h1 className="text-2xl font-bold leading-tight">{playlist.name}</h1>
                                {playlist.description && (
                                    <p className="text-base-content/60 mt-1 text-sm">{playlist.description}</p>
                                )}
                            </div>
                        </div>
                        {/* Header actions */}
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                className="btn btn-ghost btn-sm gap-1"
                                title="Edit playlist"
                                aria-label="Edit playlist"
                                onClick={() => setIsEditModalOpen(true)}
                            >
                                <PencilIcon className="w-4 h-4" />
                                <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button
                                className="btn btn-ghost btn-sm text-error gap-1"
                                title="Delete playlist"
                                aria-label="Delete playlist"
                                onClick={handleDelete}
                            >
                                <Trash2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Delete</span>
                            </button>
                        </div>
                    </div>

                    {/* ── Summary bar ───────────────────────────────────── */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-5 pt-4 border-t border-base-200 text-sm">
                        <span className="font-medium">
                            {stats.total} problem{stats.total !== 1 ? "s" : ""}
                        </span>
                        <span className="text-base-content/30">·</span>
                        <span className="text-success font-medium">{stats.solved} solved</span>
                        {stats.easy > 0 && (
                            <span className="badge badge-success badge-outline badge-sm">
                                {stats.easy} Easy
                            </span>
                        )}
                        {stats.medium > 0 && (
                            <span className="badge badge-warning badge-outline badge-sm">
                                {stats.medium} Medium
                            </span>
                        )}
                        {stats.hard > 0 && (
                            <span className="badge badge-error badge-outline badge-sm">
                                {stats.hard} Hard
                            </span>
                        )}
                    </div>
                </div>

                {/* ── Problem list ──────────────────────────────────────── */}
                <div className="card bg-base-100 shadow-md overflow-hidden">
                    {problems.length === 0 ? (
                        /* Empty state */
                        <div className="flex flex-col items-center justify-center py-20 gap-4 px-4 text-center">
                            <BookOpen className="w-12 h-12 text-base-content/20" />
                            <div>
                                <p className="text-lg font-semibold text-base-content/60">
                                    No problems yet
                                </p>
                                <p className="text-sm text-base-content/40 mt-1">
                                    Add problems to this playlist from the problem list.
                                </p>
                            </div>
                            <button
                                className="btn btn-primary btn-sm mt-2"
                                onClick={() => navigate("/")}
                            >
                                Browse Problems
                            </button>
                        </div>
                    ) : (
                        /* Problem table */
                        <div className="overflow-x-auto">
                            <table className="table table-zebra w-full">
                                <thead>
                                    <tr>
                                        <th className="w-8"></th>
                                        <th>Title</th>
                                        <th className="w-28">Difficulty</th>
                                        <th className="w-12"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {problems.map((entry) => {
                                        const isSolved   = solvedIdSet.has(entry.problemId);
                                        const difficulty = entry.problem?.difficulty;
                                        const badge      = difficulty ? DIFFICULTY_BADGE[difficulty] : null;

                                        return (
                                            <tr key={entry.id ?? entry.problemId} className="hover">

                                                {/* Solved indicator */}
                                                <td>
                                                    {isSolved
                                                        ? <CheckCircle2 className="w-4 h-4 text-success" aria-label="Solved" />
                                                        : <Circle       className="w-4 h-4 text-base-content/20" aria-label="Not solved" />
                                                    }
                                                </td>

                                                {/* Title — clicking navigates to problem */}
                                                <td>
                                                    <Link
                                                        to={`/problem/${entry.problemId}`}
                                                        className="font-medium hover:text-primary transition-colors"
                                                    >
                                                        {entry.problem?.title ?? entry.problemId}
                                                    </Link>
                                                </td>

                                                {/* Difficulty badge */}
                                                <td>
                                                    {badge && (
                                                        <span className={`badge badge-sm font-semibold text-white ${badge.cls}`}>
                                                            {badge.label}
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Remove */}
                                                <td>
                                                    <button
                                                        className="btn btn-ghost btn-xs text-error"
                                                        title="Remove from playlist"
                                                        aria-label={`Remove ${entry.problem?.title ?? "problem"} from playlist`}
                                                        onClick={() => handleRemove(entry.problemId)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit modal — reuses the existing modal, passes fetchAPlaylist as the refresh */}
            <EditPlaylistModal
                isOpen={isEditModalOpen}
                onClose={async () => {
                    setIsEditModalOpen(false);
                    await fetchAPlaylist(id);
                }}
                playlist={{ id: playlist.id, name: playlist.name, description: playlist.description ?? "" }}
            />
        </div>
    );
};

export default PlaylistPage;
