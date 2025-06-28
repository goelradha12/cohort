import React, { useMemo, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Bookmark, PencilIcon, Plus, TrashIcon } from "lucide-react";
import { Link } from "react-router";

const ProblemTable = ({ problems, solvedProblems }) => {
    const { authUser } = useAuthStore();

    const [search, setSearch] = useState("");
    const [difficulty, setDifficulty] = useState("ALL");
    const [selectedTag, setSelectedTag] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);

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
            return titleMatch && difficultyMatch && tagMatch;
        });
    }, [problems, search, difficulty, selectedTag]);

    // pagination logic
    const problemsPerPage = 5;
    const totalPages = Math.ceil(filteredProblems.length / problemsPerPage);
    const currentProblems = useMemo(() => {
        const startIndex = (currentPage - 1) * problemsPerPage;
        const endIndex = startIndex + problemsPerPage;
        return filteredProblems.slice(startIndex, endIndex);
    }, [filteredProblems, currentPage]); // problems to display

    // handling admin action buttons
    const handleDelete = (problemId) => {
        console.log("Delete button", problemId);
    }
    const handleAddToPlaylist = (problemId) => {
        console.log("Add to playlist button", problemId);

    }
    const handleEdit = (problemId) => {
        console.log("Edit button", problemId);
    }
    return (
        <div className="w-full max-w-6xl mx-auto mt-10">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Problems</h2>
                <button className="btn btn-primary gap-2">
                    <Plus className="w-4 h-4" />
                    Create Playlist
                </button>
            </div>
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <input
                    type="text"
                    placeholder="Search by title"
                    name="search"
                    className="input input-bordered w-full md:w-1/3 bg-base-200"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={difficulty}
                    name="difficulty"
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="select select-bordered bg-base-200"
                >
                    <option value="ALL">All Difficulty</option>
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                </select>

                <select
                    value={selectedTag}
                    name="tag"
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="select select-bordered bg-base-200"
                >
                    <option value="ALL">All Tags</option>
                    {allTags.map((tag) => (
                        <option key={tag} value={tag}>
                            {tag}
                        </option>
                    ))}
                </select>
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
                        {/* {console.log(currentProblems, problems, filteredProblems, solvedProblems)} */}
                        {currentProblems.length === 0 && <tr><td colSpan="5" className="text-center">No problems found</td></tr>}
                        {currentProblems.map((problem) => {
                            const isSolved = solvedProblems.map((p) => p.id).includes(problem.id)
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
                                                    <button onClick={() => handleEdit(problem.id)} className="btn btn-sm btn-warning">
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
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                <span className="btn btn-ghost btn-sm">

                    {`${currentPage} / ${totalPages}`}
                </span>
                <button
                    className="btn btn-sm btn-primary"
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ProblemTable;
