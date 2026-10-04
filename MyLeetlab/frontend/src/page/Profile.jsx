import React, { useEffect, useMemo, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useSubmissionStore } from '../store/useSubmissionStore'
import { useProblemStore } from '../store/useProblemStore'
import { Eye, EyeOff, Loader } from 'lucide-react'
import { usePlaylistStore } from '../store/usePlaylistStore'
import Heatmap from '../components/Heatmap'
import "../App.css"
import DisplayPlaylistModal from '../components/modals/DisplayPlaylistModal'
import EditPlaylistModal from '../components/modals/EditPlaylistModal'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'
import InitialsAvatar from '../components/InitialsAvatar'

const Profile = () => {
    const { authUser, checkAuth, isCheckingAuth } = useAuthStore()
    const { getAllSubmission, submissions } = useSubmissionStore()
    const { playlists, fetchPlaylists, isFetchingPlaylists, deleteAPlaylist } = usePlaylistStore()
    const { getSolvedProblemByUser, solvedProblems } = useProblemStore()
    const [wrongSubmissionCount, setWrongSubmissionCount] = useState(0)
    const [correctSubmissionCount, setCorrectSubmissionCount] = useState(0)
    const [subimissionDates, setSubimissionDates] = useState([])

    // profile edits
    const [isEditingProfile, setIsEditingProfile] = useState(false)
    const [newName, setNewName] = useState('')
    const [isEditingProfileImage, setIsEditingProfileImage] = useState(false)
    const [newProfileImage, setNewProfileImage] = useState(null)
    const [isProfileLoading, setIsProfileLoading] = useState(false)

    // password change — item 26
    const [isEditingProfilePassword, setIsEditingProfilePassword] = useState(false)
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    // playlist modals
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
        let correct = 0
        let wrong = 0
        submissions.forEach(submission => {
            if (submission.status === 'ACCEPTED') correct += 1
            else wrong += 1
        })
        setCorrectSubmissionCount(correct)
        setWrongSubmissionCount(wrong)
    }, [submissions])

    useEffect(() => {
        if (submissions) {
            const submissionDateList = submissions.map(submission => {
                const date = new Date(submission.createdAt)
                return {
                    year: date.getFullYear(),
                    month: date.toLocaleString('default', { month: 'short' }),
                    day: date.getDate()
                }
            })
            setSubimissionDates(submissionDateList)
        }
    }, [submissions])

    const handleViewPlaylist = (e, id) => {
        e.preventDefault()
        setSelectedPlaylistId(id)
        setIsDisplayPlaylistModalOpen(true)
    }
    const handleEditPlaylist = (e, id, name, description) => {
        setSelectedPlaylistForEdit({ id, name, description })
        setIsEditPlaylistModalOpen(true)
    }
    const handleDeletePlaylist = async (e, id) => {
        const confirmation = window.confirm('Are you sure you want to delete this playlist?')
        if (confirmation) {
            setSelectedPlaylistId(id)
            await deleteAPlaylist(id) // pass id directly — selectedPlaylistId is stale until next render
            await fetchPlaylists()
        }
    }

    const handleEditUserName = async () => {
        try {
            const response = await axiosInstance.post('/auth/updateProfile', { newName })
            toast.success(response.data?.message || 'Profile updated successfully')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating profile')
        } finally {
            setIsEditingProfile(false)
            await checkAuth()
        }
    }

    // item 26: validate before calling API
    const handleEditPassword = async () => {
        if (oldPassword.length < 6) { toast.error('Current password is too short'); return }
        if (newPassword.length < 6) { toast.error('New password must be at least 6 characters'); return }
        if (newPassword !== confirmNewPassword) { toast.error("New passwords don't match"); return }
        try {
            const res = await axiosInstance.post('/auth/changePassword', {
                email: authUser.email,
                oldPassword,
                newPassword,
            })
            toast.success(res.data?.message || 'Password updated successfully')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating password')
        } finally {
            await checkAuth()
            setIsEditingProfilePassword(false)
            setOldPassword(''); setNewPassword(''); setConfirmNewPassword('')
        }
    }

    const handleEditUserProfile = async () => {
        if (!newProfileImage) {
            toast.error('Please choose an image first')
            return
        }
        try {
            setIsProfileLoading(true)
            const formData = new FormData()
            formData.append('newImage', newProfileImage)
            const res = await axiosInstance.post('/auth/updateProfile', formData)
            toast.success(res.data?.message || 'Image updated successfully')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating image')
        } finally {
            await checkAuth()
            setIsProfileLoading(false)
            setIsEditingProfileImage(false)
        }
    }

    return (
        <div className=''>
            <div className="container mx-auto p-4 mb-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Col 1 — profile info + password */}
                    <div className="card bg-base-100 shadow-xl p-4 border-success/20 border-1 justify-around">
                        <div>
                            <h1 className='text-2xl font-semibold pb-2 pl-4'>Profile</h1>
                        </div>
                        <table className='table'>
                            <tbody>
                                <tr>
                                    <th>Name</th>
                                    <td>
                                        {isEditingProfile ? (
                                            <>
                                                <input
                                                    type="text"
                                                    className="input input-bordered input-sm max-w-1/2"
                                                    defaultValue={authUser.name || 'NA'}
                                                    onChange={(e) => setNewName(e.target.value)}
                                                />
                                                <button className="btn btn-success btn-sm ml-2" onClick={handleEditUserName}>Save</button>
                                                <button className="btn btn-ghost btn-sm ml-2" onClick={() => setIsEditingProfile(false)}>Cancel</button>
                                            </>
                                        ) : (
                                            <div className='flex items-center justify-between'>
                                                {isCheckingAuth
                                                    ? <Loader className="w-4 h-4 animate-spin" />
                                                    : authUser.name || 'NA'}
                                                <button
                                                    className="btn btn-link btn-sm hover:border-success"
                                                    onClick={() => setIsEditingProfile(true)}
                                                    disabled={isEditingProfile}
                                                >Edit</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                                <tr><th>Email</th><td>{authUser.email}</td></tr>
                                <tr><th>Role</th><td>{authUser.role}</td></tr>
                                <tr><th>Created At</th><td>{new Date(authUser.createdAt).toDateString()}</td></tr>
                                <tr>
                                    <th>Is Verified</th>
                                    <td>{authUser.isVerified ? 'Verified' : 'Not Verified'}</td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Change password — item 26 */}
                        <div className='text-sm mt-4'>
                            {isEditingProfilePassword ? (
                                <div className='flex flex-col gap-2'>
                                    <div className='flex items-center gap-2'>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className='input input-sm flex-1'
                                            placeholder='Current password'
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                        />
                                        <button
                                            type='button'
                                            className='px-2 cursor-pointer'
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword
                                                ? <EyeOff className='h-4 w-4 text-base-content/40' />
                                                : <Eye className='h-4 w-4 text-base-content/40' />}
                                        </button>
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className='input input-sm'
                                        placeholder='New password (min 6 chars)'
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className='input input-sm'
                                        placeholder='Confirm new password'
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    />
                                    <div className='flex gap-2 mt-1'>
                                        <button className='btn btn-success btn-sm' onClick={handleEditPassword}>Update</button>
                                        <button
                                            className='btn btn-outline btn-sm'
                                            onClick={() => {
                                                setIsEditingProfilePassword(false)
                                                setOldPassword(''); setNewPassword(''); setConfirmNewPassword('')
                                            }}
                                        >Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <span className='flex items-center gap-1'>
                                    Change Password
                                    <button
                                        className='btn btn-link p-0 hover:dark:text-white hover:text-black'
                                        onClick={() => setIsEditingProfilePassword(true)}
                                    >Here</button>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Col 2 — avatar + stats */}
                    <div className="card bg-base-100 shadow-xl p-4 border-success/20 border-1">
                        <div className='grid items-center justify-center'>
                            {authUser.avatar ? (
                                <img
                                    src={authUser.avatar}
                                    alt="User Avatar"
                                    className="object-cover w-24 h-24 rounded-full"
                                />
                            ) : (
                                <InitialsAvatar
                                    name={authUser.name}
                                    size={96}
                                    className="rounded-full border-2 border-primary/50"
                                />
                            )}
                        </div>
                        <div className='grid justify-end'>
                            {isEditingProfileImage ? (
                                isProfileLoading ? (
                                    <div className='flex items-center gap-3'>
                                        <Loader className='w-4 h-4 animate-spin' />
                                        <span>Loading...</span>
                                    </div>
                                ) : (
                                    <div className='flex items-center pt-4'>
                                        <input
                                            type="file"
                                            accept='image/*'
                                            required
                                            className="file-input-primary file-input"
                                            onChange={(e) => setNewProfileImage(e.target.files[0])}
                                        />
                                        <button className="btn btn-success btn-sm ml-2" onClick={handleEditUserProfile}>Update</button>
                                        <button className="btn btn-ghost btn-sm ml-2" onClick={() => setIsEditingProfileImage(false)}>Cancel</button>
                                    </div>
                                )
                            ) : (
                                <div className='flex items-center justify-between'>
                                    <button
                                        className="btn btn-link btn-sm hover:border-success"
                                        onClick={() => setIsEditingProfileImage(true)}
                                        disabled={isEditingProfile}
                                    >Edit Image</button>
                                </div>
                            )}
                        </div>

                        {/* Submission counts */}
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
                                </tbody>
                            </table>

                            {/* Difficulty breakdown — item 23 */}
                            {(() => {
                                const easy   = solvedProblems.filter(p => p.problem?.difficulty === 'EASY').length
                                const medium = solvedProblems.filter(p => p.problem?.difficulty === 'MEDIUM').length
                                const hard   = solvedProblems.filter(p => p.problem?.difficulty === 'HARD').length
                                const total  = solvedProblems.length
                                return (
                                    <div className="mt-4 px-1 space-y-2">
                                        <p className="text-sm font-semibold text-base-content/60 mb-2">
                                            Problems Solved — <span className="text-base-content">{total}</span> total
                                        </p>
                                        {[
                                            { label: 'Easy',   count: easy,   cls: 'progress-success' },
                                            { label: 'Medium', count: medium, cls: 'progress-warning' },
                                            { label: 'Hard',   count: hard,   cls: 'progress-error'   },
                                        ].map(({ label, count, cls }) => (
                                            <div key={label} className="flex items-center gap-3">
                                                <span className="w-14 text-xs text-base-content/60">{label}</span>
                                                <progress
                                                    className={`progress ${cls} flex-1 h-2`}
                                                    value={count}
                                                    max={Math.max(total, 1)}
                                                />
                                                <span className="w-5 text-xs text-right text-base-content/70">{count}</span>
                                            </div>
                                        ))}
                                    </div>
                                )
                            })()}
                        </div>
                    </div>
                </div>

                {/* Heatmap */}
                <div className="container p-4 border-success/20 border-1 shadow-xl mx-auto card mt-10">
                    <h2 className='pb-2 pl-4'>
                        <span className="text-xl font-semibold"> Submission Heatmap </span>
                        <span className='text-success text-md'>{'( ' + new Date().getFullYear() + ' )'}</span>
                    </h2>
                    <div className="graph p-4 m-4 text-sm md:overflow-x-scroll">
                        <ul className="months">
                            {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => <li key={m}>{m}</li>)}
                        </ul>
                        <ul className="days">
                            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <li key={d}>{d}</li>)}
                        </ul>
                        <Heatmap allDates={subimissionDates} />
                    </div>
                </div>

                {/* Playlists */}
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
                            {isFetchingPlaylists ? (
                                <tr><td colSpan={4}>Fetching Playlists...</td></tr>
                            ) : (
                                playlists.map((playlist) => (
                                    <tr key={playlist.id}>
                                        <td>{playlist.name}</td>
                                        <td>{playlist.problem.length}</td>
                                        <td>
                                            {playlist.description
                                                ? playlist.description.length > 50
                                                    ? playlist.description.slice(0, 50) + '...'
                                                    : playlist.description
                                                : 'No description'}
                                        </td>
                                        <td className='flex gap-2'>
                                            <button onClick={(e) => handleViewPlaylist(e, playlist.id)} className='btn btn-sm btn-outline'>View</button>
                                            <button onClick={(e) => handleEditPlaylist(e, playlist.id, playlist.name, playlist.description)} className='btn btn-sm btn-outline'>Edit</button>
                                            <button onClick={(e) => handleDeletePlaylist(e, playlist.id)} className='btn btn-sm btn-outline btn-error'>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <DisplayPlaylistModal
                isOpen={isDisplayPlaylistModalOpen}
                onClose={() => setIsDisplayPlaylistModalOpen(false)}
                playlistId={selectedPlaylistId}
            />
            <EditPlaylistModal
                isOpen={isEditPlaylistModalOpen}
                onClose={() => setIsEditPlaylistModalOpen(false)}
                playlist={selectedPlaylistForEdit}
            />
        </div>
    )
}

export default Profile
