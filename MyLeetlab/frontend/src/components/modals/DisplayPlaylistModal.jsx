import React, { useEffect, useState } from "react";
import { usePlaylistStore } from "../../store/usePlaylistStore";
import { Loader, X } from "lucide-react";
import { useNavigate } from "react-router";

const DisplayPlaylistModal = ({ isOpen, onClose, playlistId }) => {
    const {
        isFetchingPlaylist,
        playlist,
        fetchAPlaylist,
        removeProblemFromPlaylist,
    } = usePlaylistStore();
    const navigate = useNavigate();
    const [selectedProblemId, setSelectedProblemId] = useState(null);
    const [selectedProblemIdForEdit, setSelectedProblemIdForEdit] = useState(null);

    useEffect(() => {
        if (isOpen) {
            console.log("Fetching: ", playlistId);
            fetchAPlaylist(playlistId);
        }
    }, [isOpen]);

    const handleRemoveProblem = async (e) => {
        e.preventDefault();
        if (!selectedProblemIdForEdit) return
        let data = {problemIds: [selectedProblemIdForEdit]};
        await removeProblemFromPlaylist(playlistId, data);
        await fetchAPlaylist(playlistId);
    };
    const handleViewProblem = (e) => {
        e.preventDefault();
        if (!selectedProblemId) return
        navigate(`/problem/${selectedProblemId}`);
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-base-100 rounded-lg shadow-xl w-full mx-[10%]">
                <div className="flex justify-between items-center p-4 border-b border-base-300">
                    {console.log(playlist)}
                    <h2 className="font-bold text-lg">{playlist? playlist.name : "Fetching"}</h2>
                    <button
                        onClick={onClose}
                        className="btn btn-ghost btn-sm btn-circle"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {isFetchingPlaylist ? (
                    <div className="flex justify-center items-center h-full gap-2 p-4">
                        <Loader className="w-5 h-5 animate-spin" />
                        Fetching Data...
                    </div>
                ) : playlist ? (
                    <>
                        <div className="h-[70vh] overflow-y-scroll">
                            <div className="p-6 space-y-4 border-b border-base-300">
                                <h3 className="text-lg font-normal">Description: </h3>
                                <span className="font-light">
                                    {playlist.description || "-"}
                                </span>
                            </div>
                            <div className="p-6 space-y-4">
                                <h3 className="text-lg font-normal">Problems: </h3>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Added At</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {playlist.problem?.map((problem) => (
                                            <tr key={problem.id}>
                                                <td>{problem.problem.title}</td>
                                                <td>{new Date(problem.createdAt).toLocaleString()}</td>
                                                <td className="flex gap-4">
                                                    <button
                                                        onClick={(e) => {
                                                            setSelectedProblemIdForEdit(problem.problemId)
                                                            handleRemoveProblem(e);
                                                        }}
                                                        className="btn btn-error btn-sm"
                                                    >
                                                        Remove
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            setSelectedProblemId(problem.problemId)
                                                            handleViewProblem(e);
                                                        }}
                                                        className="btn btn-outline btn-sm"
                                                        title="double click to view"
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex justify-center items-center h-full gap-2 p-4">
                            Playlist Doesn't Exists
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DisplayPlaylistModal;
