import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useSubmissionStore } from '../store/useSubmissionStore'
import { useProblemStore } from '../store/useProblemStore'

const Profile = () => {
    const { authUser } = useAuthStore()
    const { getAllSubmission, submissions, gettingSubmissions } = useSubmissionStore()
    const { getSolvedProblemByUser, solvedProblems } = useProblemStore()
    const [ wrongSubmissionCount, setWrongSubmissionCount ] = useState(0)
    const [ correctSubmissionCount, setCorrectSubmissionCount ] = useState(0)
    useEffect(() => {
        getAllSubmission()
        getSolvedProblemByUser()
        
    }, [getAllSubmission])
    
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
    return (
        <div className=''>
            <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* COl 1 */}
                    <div className="card bg-base-100 shadow-xl p-4 border-success/50 border-1 justify-around">
                        <div>
                            <h1 className='text-2xl font-semibold pb-2 pl-4'>Profile</h1>
                        </div>
                        <table className='table'>
                            <tbody>

                                <tr>
                                    <th>Name</th>
                                    <td>{authUser.name ? authUser.name : "NA"}</td>
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
                    <div className="card bg-base-100 shadow-xl p-4 border-success/50 border-1">
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
            </div>
        </div>
    )
}

export default Profile
