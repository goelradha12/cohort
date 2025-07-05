import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useSubmissionStore } from '../store/useSubmissionStore'
import { useProblemStore } from '../store/useProblemStore'
import { Loader } from 'lucide-react'
import { usePlaylistStore } from '../store/usePlaylistStore'
import Heatmap from '../components/Heatmap'
import "../App.css"
import DisplayPlaylistModal from '../components/modals/DisplayPlaylistModal'
import EditPlaylistModal from '../components/modals/EditPlaylistModal'

const Profile = () => {
    const { authUser } = useAuthStore()
    const { getAllSubmission, submissions } = useSubmissionStore()
    const { playlists, fetchPlaylists, isFetchingPlaylists, deleteAPlaylist, editAPlaylist } = usePlaylistStore()
    const { getSolvedProblemByUser, solvedProblems } = useProblemStore()
    const [wrongSubmissionCount, setWrongSubmissionCount] = useState(0)
    const [correctSubmissionCount, setCorrectSubmissionCount] = useState(0)
    const [subimissionDates, setSubimissionDates] = useState([])

    // For viewing playlist modal
    const [isDisplayPlaylistModalOpen, setIsDisplayPlaylistModalOpen] = useState(false)
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null)

    const [isEditPlaylistModalOpen, setIsEditPlaylistModalOpen] = useState(false)
    const [selectedPlaylistForEdit, setSelectedPlaylistForEdit] = useState({})

    useEffect(() => {
        if (authUser) {
            getAllSubmission()
            getSolvedProblemByUser()
        }
    }, [])

    useEffect(() => {
        fetchPlaylists()
    }, [selectedPlaylistId])

    useEffect(() => {
        // a function to find correct and wrong submissions by user
        let correct = 0;
        let wrong = 0;

        submissions.forEach(submission => {
            if (submission.status === "ACCEPTED") {
                correct += 1;
            } else {
                wrong += 1;
            }
        });
        setCorrectSubmissionCount(correct);
        setWrongSubmissionCount(wrong);
    }, [submissions])

    useEffect(() => {
        if (submissions) {

            // calculate number of submission on each day
            const submissionDateList = submissions.map(submission => {
                const date = new Date(submission.createdAt)
                return {
                    year: date.getFullYear(),
                    month: date.toLocaleString('default', { month: 'short' }),
                    day: date.getDate()
                };
            })
            setSubimissionDates(submissionDateList)

        }
    }, [submissions])

    const handleViewPlaylist = (e, id) => {
        e.preventDefault();
        setSelectedPlaylistId(id)
        setIsDisplayPlaylistModalOpen(true)
    }
    const handleEditPlaylist = (e, id, name, description) => {
        setSelectedPlaylistForEdit({ id, name, description })
        setIsEditPlaylistModalOpen(true)
    }
    const handleDeletePlaylist = async (e, id) => {
        const confirmation = window.confirm("Are you sure you want to delete this playlist?")
        if (confirmation) {
            setSelectedPlaylistId(id)
            await deleteAPlaylist(selectedPlaylistId)
            await fetchPlaylists()
        }
    }
    return (
        <div className=''>
            <div className="container mx-auto p-4 mb-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* COl 1 */}
                    <div className="card bg-base-100 shadow-xl p-4 border-success/20 border-1 justify-around">
                        <div>
                            <h1 className='text-2xl font-semibold pb-2 pl-4'>Profile</h1>
                        </div>
                        <table className='table'>
                            <tbody>

                                <tr>
                                    <th>Name</th>
                                    <td>{authUser.name ? authUser.name : "NA"}</td>
                                    <td><button className="btn btn-neutral">Edit</button></td>
                                </tr>
                                <tr>
                                    <th>Email</th>
                                    <td>{authUser.email}</td>
                                </tr>
                                <tr>
                                    <th>Role</th>
                                    <td>{authUser.role}</td>
                                </tr>
                                <tr>
                                    <th>Created At</th>
                                    <td>{new Date(authUser.createdAt).toDateString()}</td>
                                </tr>
                                <tr>
                                    <th>Is Verified</th>
                                    <td>{authUser.isVerified ? "Verified" : "Not Verified"}</td>
                                </tr>
                            </tbody>
                        </table>

                    </div>
                    {/* COl 2 */}
                    <div className="card bg-base-100 shadow-xl p-4 border-success/20 border-1">
                        <div className='grid items-center justify-center'>
                            {authUser.avatar ?
                                "Yes" : <img
                                    src={`https://avatar.iran.liara.run/public`}
                                    alt="User Avatar"
                                    className="object-cover border-2 border-success/50 h-30 rounded-full"
                                />
                            }
                        </div>
                        <div className='mt-4'>
                            <table className='table'>
                                <tbody>
                                    <tr>
                                        <th>Total Submissions</th>
                                        <td>{submissions.length}</td>
                                    </tr>
                                    <tr>
                                        <th>Correct Submissions</th>
                                        <td>{correctSubmissionCount}</td>
                                    </tr>
                                    <tr>
                                        <th>Wrong Submissions</th>
                                        <td>{wrongSubmissionCount}</td>
                                    </tr>
                                    <tr>
                                        <th>Problem Solved</th>
                                        <td>{solvedProblems.length}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="container p-4 border-success/20 border-1 shadow-xl mx-auto card mt-10">
                    <h2 className=' pb-2 pl-4'>
                        <span className="text-xl font-semibold"> Submission Heatmap </span>
                        <span className='text-success text-md '>{"( " + new Date().getFullYear() + " )"}</span>
                    </h2>

                    <div className="graph p-4 m-4 text-sm overflow-x-scroll">
                        <ul className="months">
                            <li>Jan</li>
                            <li>Feb</li>
                            <li>Mar</li>
                            <li>Apr</li>
                            <li>May</li>
                            <li>Jun</li>
                            <li>Jul</li>
                            <li>Aug</li>
                            <li>Sep</li>
                            <li>Oct</li>
                            <li>Nov</li>
                            <li>Dec</li>
                        </ul>
                        <ul className="days">
                            <li>Sun</li>
                            <li>Mon</li>
                            <li>Tue</li>
                            <li>Wed</li>
                            <li>Thu</li>
                            <li>Fri</li>
                            <li>Sat</li>
                        </ul>
                        {<Heatmap allDates={subimissionDates} />}
                    </div>
                </div>
                <div className="container p-4 border-success/20 border-1 shadow-xl mx-auto card mt-10">
                    <h2 className='text-xl font-semibold pb-2 pl-4'>Playlists</h2>

                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Playlist Name</th>
                                <th>Problem Count</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isFetchingPlaylists ?
                                <tr><td colSpan={4}>Fetching Playlists...</td></tr>
                                :
                                playlists.map((playlist) => (
                                    <tr key={playlist.id}>
                                        <td>{playlist.name}</td>
                                        <td>{playlist.problem.length}</td>
                                        <td>{playlist.description.slice(0, 50) + "..."}</td>
                                        <td className='flex gap-2'>
                                            <button onClick={(e) => handleViewPlaylist(e, playlist.id)} className='btn btn-sm btn-outline'>View</button>
                                            <button onClick={(e) => handleEditPlaylist(e, playlist.id, playlist.name, playlist.description)} className='btn btn-sm btn-outline'>Edit</button>
                                            <button onClick={(e) => handleDeletePlaylist(e, playlist.id)} className='btn btn-sm btn-outline btn-error'>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <DisplayPlaylistModal isOpen={isDisplayPlaylistModalOpen} onClose={() => setIsDisplayPlaylistModalOpen(false)} playlistId={selectedPlaylistId} />
            <EditPlaylistModal isOpen={isEditPlaylistModalOpen} onClose={() => setIsEditPlaylistModalOpen(false)} playlist={selectedPlaylistForEdit} />
        </div>
    )
}

export default Profile
