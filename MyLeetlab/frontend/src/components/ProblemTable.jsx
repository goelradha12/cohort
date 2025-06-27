import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Plus } from "lucide-react";

const ProblemTable = ({ problems }) => {
    const { authUser } = useAuthStore();

    const [search, setSearch] = useState("");
    const [difficulty, setDifficulty] = useState("ALL");
    const [selectedTag, setSelectedTag] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);

    return (
        <div className="w-full max-w-6xl mx-auto mt-10">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Problems</h2>
                <button className="btn btn-primary gap-2">
                    <Plus className="w-4 h-4"/>
                    Create Playlist</button>
            </div>
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <input type="text"
                placeholder="Search by title"
                className="input input-bordered w-full md:w-1/3 bg-base-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)} />
            
                <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="select select-bordered w-full md:w-1/3 bg-base-200"
                >
                <option value="ALL">All Difficulty</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
                </select>

                <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="select select-bordered w-full md:w-1/3 bg-base-200"
                >
                <option value="ALL">All Tags</option>
                {authUser?.tags?.map((tag) => (
                <option key={tag} value={tag}>
                    {tag}
                </option>
                ))}
                </select>

            </div>
            {problems.map((problem) => {
                return `<h3>${problem.title}</h3>`;
            })}
        </div>
    );
};

export default ProblemTable;
