import React, { useMemo, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Plus } from "lucide-react";

const ProblemTable = ({ problems }) => {
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
                </table>
            </div>
        </div>
    );
};

export default ProblemTable;
