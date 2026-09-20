import React, { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Bookmark, PencilIcon, Plus, Search, TrashIcon, X } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router";
import CreatePlaylistModal from "./modals/CreatePlaylistModal";
import { usePlaylistStore } from "../store/usePlaylistStore";
import AddToPlaylistModal from "./modals/AddToPlaylistModal";
import { useProblemStore } from "../store/useProblemStore";
import { useCompanyStore } from "../store/useCompanyStore";

const ProblemTable = ({ problems, solvedProblems }) => {
    const { authUser } = useAuthStore();

    // Filter state lives in the URL query string so filtered practice views are
    // shareable/bookmarkable (e.g. ?company=<id>&year=2023).
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get("search") || "";
    const difficulty = searchParams.get("difficulty") || "ALL";
    const selectedTag = searchParams.get("tag") || "ALL";
    const companyId = searchParams.get("company") || "";
    const year = searchParams.get("year") || "";
    const currentPage = Number(searchParams.get("page")) || 1;

    const [isCreatePlaylistModalOpen, setIsCreatePlaylistModalOpen] = useState(false)
    const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);
    const [selectedProblemId, setSelectedProblemId] = useState(null);

    const { createNewPlaylist } = usePlaylistStore();
    const { deleteAProblem, getAllProblem } = useProblemStore();
    const { companies: companyOptions, fetchCompanies } = useCompanyStore();

    const navigate = useNavigate();

    useEffect(() => {
        fetchCompanies();
    }, []);

    // Update one or more query params; resets to page 1 unless page is set.
    const updateParams = (updates) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            Object.entries(updates).forEach(([key, value]) => {
                if (value === "" || value === null || value === undefined) {
                    next.delete(key);
                } else {
                    next.set(key, String(value));
                }
            });
            if (!("page" in updates)) next.delete("page");
            return next;
        });
    };

    // Clear all filter params at once (keeps the user on page 1).
    const clearFilters = () => setSearchParams(new URLSearchParams());

    // How many filters are currently active (for the clear button + label).
    const activeFilterCount =
        (search ? 1 : 0) +
        (difficulty !== "ALL" ? 1 : 0) +
        (selectedTag !== "ALL" ? 1 : 0) +
        (companyId ? 1 : 0) +
        (year ? 1 : 0);

    // companyId -> name map for resolving names (spec item 9).
    const companyMap = useMemo(
        () => new Map(companyOptions.map((c) => [c.id, c.name])),
        [companyOptions]
    );

    // getting list of tags and removing duplicates
    const allTags = useMemo(() => {
        if (!Array.isArray(problems)) return [];
        const tagSet = new Set();
        problems.forEach((problem) => {
            problem.tags.forEach((tag) => {
                tagSet.add(tag);
            });
        });
        return Array.from(tagSet);
    }, [problems]);

    // Company filter options: only companies that appear on at least one problem,
    // resolved through the /companies map, sorted alphabetically.
    const companyFilterOptions = useMemo(() => {
        const idsInUse = new Set();
        (problems || []).forEach((problem) => {
            if (Array.isArray(problem.companies)) {
                problem.companies.forEach((entry) => {
                    if (companyMap.has(entry.companyId)) idsInUse.add(entry.companyId);
                });
            }
        });
        return Array.from(idsInUse)
            .map((id) => ({ id, name: companyMap.get(id) }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [problems, companyMap]);

    // Year filter options: derived from company entries on loaded problems, desc.
    const yearFilterOptions = useMemo(() => {
        const years = new Set();
        (problems || []).forEach((problem) => {
            if (Array.isArray(problem.companies)) {
                problem.companies.forEach((entry) => {
                    if (entry.year != null) years.add(Number(entry.year));
                });
            }
        });
        return Array.from(years).sort((a, b) => b - a);
    }, [problems]);

    // filtering problems
    const filteredProblems = useMemo(() => {
        return (problems || []).filter((problem) => {
            const titleMatch = problem.title
                .toLowerCase()
                .includes(search.toLowerCase());
            const difficultyMatch =
                difficulty === "ALL" || problem.difficulty === difficulty;
            const tagMatch =
                selectedTag === "ALL" || problem.tags.includes(selectedTag);

            // Company + year must match the SAME company entry. A problem with
            // Google/2021 + Amazon/2023 must NOT match Google + 2023.
            let companyYearMatch = true;
            if (companyId || year) {
                const companies = Array.isArray(problem.companies) ? problem.companies : [];
                companyYearMatch = companies.some(
                    (c) =>
                        (!companyId || c.companyId === companyId) &&
                        (!year || Number(c.year) === Number(year))
                );
            }

            return titleMatch && difficultyMatch && tagMatch && companyYearMatch;
        });
    }, [problems, search, difficulty, selectedTag, companyId, year]);

    // pagination logic
    const problemsPerPage = 10;
    const totalPages = Math.ceil(filteredProblems.length / problemsPerPage);
    const currentProblems = useMemo(() => {
        const startIndex = (currentPage - 1) * problemsPerPage;
        const endIndex = startIndex + problemsPerPage;
        return filteredProblems.slice(startIndex, endIndex);
    }, [filteredProblems, currentPage]); // problems to display

    // handling admin action buttons
    const handleDelete = async (problemId) => {
        // console.log("Delete button", problemId);
        const confirmation = confirm("Are you sure you want to delete this problem?");
        if (!confirmation) return;
        await deleteAProblem(problemId);
        await getAllProblem();
    }
    const handleAddToPlaylist = (problemId) => {
        setSelectedProblemId(problemId);
        setIsAddToPlaylistModalOpen(true);
    }

    return (
        <div className="w-full max-w-6xl mx-auto mt-10">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Problems</h2>
                <button className="btn btn-primary gap-2 cursor-pointer" onClick={()=>{setIsCreatePlaylistModalOpen(true)}}>
                    <Plus className="w-4 h-4" />
                    Create Playlist
                </button>
            </div>
            <div className="bg-base-200 rounded-xl p-4 mb-6 space-y-4">
                {/* Search row */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search problems by title"
                        name="search"
                        className="input input-bordered w-full bg-base-100 pl-10"
                        value={search}
                        onChange={(e) => updateParams({ search: e.target.value })}
                    />
                </div>

                {/* Dropdown filters in an even, labeled grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <label className="form-control">
                        <span className="label-text text-xs opacity-60 mb-1">Difficulty</span>
                        <select
                            value={difficulty}
                            name="difficulty"
                            onChange={(e) => updateParams({ difficulty: e.target.value === "ALL" ? "" : e.target.value })}
                            className="select select-bordered select-sm bg-base-100 w-full"
                        >
                            <option value="ALL">All</option>
                            <option value="EASY">Easy</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HARD">Hard</option>
                        </select>
                    </label>

                    <label className="form-control">
                        <span className="label-text text-xs opacity-60 mb-1">Tag</span>
                        <select
                            value={selectedTag}
                            name="tag"
                            onChange={(e) => updateParams({ tag: e.target.value === "ALL" ? "" : e.target.value })}
                            className="select select-bordered select-sm bg-base-100 w-full"
                        >
                            <option value="ALL">All</option>
                            {allTags.map((tag) => (
                                <option key={tag} value={tag}>
                                    {tag}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="form-control">
                        <span className="label-text text-xs opacity-60 mb-1">Company</span>
                        <select
                            value={companyId}
                            name="company"
                            onChange={(e) => updateParams({ company: e.target.value })}
                            className="select select-bordered select-sm bg-base-100 w-full"
                        >
                            <option value="">All</option>
                            {companyFilterOptions.map((company) => (
                                <option key={company.id} value={company.id}>
                                    {company.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="form-control">
                        <span className="label-text text-xs opacity-60 mb-1">Year</span>
                        <select
                            value={year}
                            name="year"
                            onChange={(e) => updateParams({ year: e.target.value })}
                            className="select select-bordered select-sm bg-base-100 w-full"
                        >
                            <option value="">All</option>
                            {yearFilterOptions.map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                {/* Active-filter summary + clear */}
                {activeFilterCount > 0 && (
                    <div className="flex items-center justify-between pt-1">
                        <span className="text-xs opacity-60">
                            {filteredProblems.length} result{filteredProblems.length === 1 ? "" : "s"} · {activeFilterCount} filter{activeFilterCount === 1 ? "" : "s"} active
                        </span>
                        <button
                            type="button"
                            className="btn btn-ghost btn-xs gap-1"
                            onClick={clearFilters}
                        >
                            <X className="w-3 h-3" />
                            Clear filters
                        </button>
                    </div>
                )}
            </div>
            <div className="overflow-x-auto rounded-xl shadow-md">
                <table className="table table-zebra table-lg bg-base-200 text-base-content">
                    <thead className="bg-base-300">
                        <tr>
                            <th>Solved</th>
                            <th>Title</th>
                            <th>Tags</th>
                            <th>Difficulty</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProblems.length === 0 && <tr><td colSpan="5" className="text-center">No problems found</td></tr>}
                        {currentProblems.map((problem) => {
                            const isSolved = solvedProblems.map((p) => p.problemId).includes(problem.id)
                            return (
                                <tr key={problem.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={isSolved}
                                            readOnly
                                            className="checkbox checkbox-sm outline-1 outline-primary"
                                        />

                                    </td>
                                    <td> <Link className="hover:text-primary" to={`/problem/${problem.id}`}>{problem.title}</Link></td>
                                    <td>
                                        {problem.tags.map((tag) => (
                                            <span key={tag} className="badge border-1 border-primary mr-2">
                                                {tag}
                                            </span>
                                        ))}
                                    </td>
                                    <td><span
                                        className={`badge font-semibold text-xs text-white ${problem.difficulty === "EASY"
                                            ? "badge-success"
                                            : problem.difficulty === "MEDIUM"
                                                ? "badge-warning"
                                                : "badge-error"
                                            }`}
                                    >
                                        {problem.difficulty}
                                    </span></td>
                                    <td>
                                        <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
                                            {authUser?.role === "ADMIN" && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleDelete(problem.id)}
                                                        className="btn btn-sm btn-error"
                                                    >
                                                        <TrashIcon className="w-4 h-4 text-white" />
                                                    </button>
                                                    <button onClick={() => navigate(`/edit-problem/${problem.id}`)} className="btn btn-sm btn-warning">
                                                        <PencilIcon className="w-4 h-4 text-white" />
                                                    </button>
                                                </div>
                                            )}
                                            <button
                                                className="btn btn-sm btn-outline flex gap-2 items-center"
                                                onClick={() => handleAddToPlaylist(problem.id)}
                                            >
                                                <Bookmark className="w-4 h-4" />
                                                <span className="hidden sm:inline">Save to Playlist</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6 gap-2">
                <button
                    className="btn btn-sm btn-primary"
                    onClick={() => updateParams({ page: currentPage - 1 })}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                <span className="btn btn-ghost btn-sm">

                    {`${currentPage} / ${totalPages || 1}`}
                </span>
                <button
                    className="btn btn-sm btn-primary"
                    onClick={() => updateParams({ page: currentPage + 1 })}
                    disabled={currentPage === totalPages || totalPages === 0}
                >
                    Next
                </button>
            </div>
            <CreatePlaylistModal 
            isOpen={isCreatePlaylistModalOpen} 
            onClose={() => setIsCreatePlaylistModalOpen(false)} 
            onSubmit={createNewPlaylist} />
            <AddToPlaylistModal 
            isOpen={isAddToPlaylistModalOpen} 
            onClose={() => setIsAddToPlaylistModalOpen(false)} 
            problemId={selectedProblemId} />
        </div>
    );
};

export default ProblemTable;
