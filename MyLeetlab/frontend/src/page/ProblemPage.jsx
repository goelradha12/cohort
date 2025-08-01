import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useProblemStore } from "../store/useProblemStore.js";
import {
    Bookmark,
    ChevronRight,
    Clock,
    Code2,
    Dot,
    FileText,
    Home,
    Lightbulb,
    Loader,
    LockKeyhole,
    LockKeyholeOpen,
    MessageSquare,
    Share2,
    Terminal,
    ThumbsUp,
    Users,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";
import Editor from '@monaco-editor/react';
import { EditorOptions } from "../components/EditorOptions.js";
import { useExecuteCodeStore } from "../store/useExecuteCodeStore.js";
import { getJudge0LanguageID } from "../lib/utilFunctions.js";
import SubmissionResult from "../components/SubmissionResult.jsx";
import SubmissionList from "../components/SubmissionList.jsx";
import { useSubmissionStore } from "../store/useSubmissionStore.js";

const ProblemPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { isProblemLoading, problem, getProblemById } = useProblemStore();
    const { authUser } = useAuthStore();

    useEffect(() => {
        getProblemById(id);
        // console.log(`AuthUser: ${JSON.stringify(authUser)}, Problem: ${problem}`)
    }, []);

    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [editorTheme, setEditorTheme] = useState("vs-dark");
    const [code, setCode] = useState("");
    const [activeTab, setActiveTab] = useState("description");
    const [testcases, setTestcases] = useState([]);
    const { isExecutingCode, executionResult, executeCode, setExecutionResultNull, isRunningCode, runCode } = useExecuteCodeStore();
    const { submissionsByProblemID, getSubmissionByProblemID, gettingSubmissionByProblemID } = useSubmissionStore(); // submissions
    const {
        problemSubmissionCountByAllUser,
        gettingProblemSubCountByAllUser,
        getProblemSubCountByAllUser } = useSubmissionStore(); // counts
    const { getSuccessProbSubCountByAll, successProbSubCountByAll } = useSubmissionStore();
    // to scroll to result div after code execution 
    const ref = useRef(null);

    const { solvedProblems, getSolvedProblemByUser } = useProblemStore();


    useEffect(() => {
        // console.log(problem);
        if (problem) {
            setSelectedLanguage(Object.keys(problem.codeSnippets)[0])
            setCode(Object.values(problem.codeSnippets)[0]);
            setTestcases(problem.testcases);
            setExecutionResultNull();
        }
    }, [problem])

    useEffect(() => {
        if(!isExecutingCode)
        {
            getProblemSubCountByAllUser(id)
            getSuccessProbSubCountByAll(id)
            getSubmissionByProblemID(id)
            getSolvedProblemByUser()
        }
    }, [isExecutingCode])

    const isProblemSolved = useMemo(() => {
        if (!problem || solvedProblems.length === 0) return false;
        // console.log(solvedProblems.map((p) => p.problem.id).includes(problem.id))
        return solvedProblems.map((p) => p.problem.id).includes(problem.id)

    }, [solvedProblems, problem])

    const successRateOfProblem = useMemo(() => {
        // console.log(problemSubmissionCountByAllUser, successProbSubCountByAll)
        if (!problem || !problemSubmissionCountByAllUser || !successProbSubCountByAll) return 0;
        return (successProbSubCountByAll/problemSubmissionCountByAllUser * 100).toFixed(2);
    },[problemSubmissionCountByAllUser, problem])
    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            const language_id = getJudge0LanguageID(selectedLanguage);
            const stdin = problem.testcases.map((tc) => tc.input);
            const expected_outputs = problem.testcases.map((tc) => tc.output);
            // console.log("data sent: ", { code, language_id, stdin, expected_outputs, id, selectedLanguage });
            executeCode(code, language_id, stdin, expected_outputs, id);
            console.log(executionResult)
        } catch (error) {
            console.log("Error executing code", error);
        }
    }
    const handleRunCode = (e) => {
        e.preventDefault();
        ref.current?.scrollIntoView({ behavior: 'smooth' });
        try {
            const language_id = getJudge0LanguageID(selectedLanguage);
            const stdin = problem.testcases.map((tc) => tc.input);
            const expected_outputs = problem.testcases.map((tc) => tc.output);
            // console.log("data sent: ", { code, language_id, stdin, expected_outputs, id, selectedLanguage });
            runCode(code, language_id, stdin, expected_outputs, id);
            console.log(executionResult)
        } catch (error) {
            console.log("Error Running code", error);
        }
    }


    const renderTabContent = () => {
        switch (activeTab) {
            case "description":
                return (
                    <div className="prose max-w-none">
                        <div className="flex items-center justify-between gap-2 pb-6">

                            <p className="font-semibold">{problem.difficulty}</p>
                            <span>
                                {problem.tags.map((tag, i) => (
                                    <span key={i} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                        {tag}
                                    </span>
                                ))}
                            </span>
                        </div>
                        <p className="text-lg mb-6">{problem.description}</p>

                        {problem.examples && (
                            <>
                                <h3 className="text-lg font-semibold mb-4">Examples:</h3>
                                {Object.entries(problem.examples).map(
                                    ([lang, example], idx) => (
                                        <div
                                            key={lang}
                                            className="bg-base-200 p-6 rounded-xl mb-6 font-mono relative"
                                        >
                                            <span className="text-indigo-500 mb-2 absolute right-4 top-4">{lang}</span>
                                            <div className="mb-4">
                                                <div className="text-indigo-500 mb-2 text-base font-semibold">
                                                    Input:
                                                </div>
                                                <span className="pb-1 rounded-lg font-semibold">
                                                    {example.input}
                                                </span>
                                            </div>
                                            <div className="mb-4">
                                                <div className="text-indigo-500 mb-2 text-base font-semibold">
                                                    Output:
                                                </div>
                                                <span className="pb-1 rounded-lg font-semibold">
                                                    {example.output}
                                                </span>
                                            </div>
                                            {example.explanation && (
                                                <div>
                                                    <div className="text-emerald-500 mb-2 text-base font-semibold">
                                                        Explanation:
                                                    </div>
                                                    <p className="text-base-content/70 text-lg font-sem">
                                                        {example.explanation}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )
                                )}
                            </>
                        )}

                        {problem.constraints && (
                            <>
                                <h3 className="text-lg font-semibold mb-4">Constraints:</h3>
                                <div className="bg-base-200 p-6 rounded-xl mb-6">
                                    <span className=" px-4 py-1 rounded-lg text-lg">
                                        {problem.constraints}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                )
            case "submissions":

                // console.log("All submissions to this problem: ", submissionsByProblemID)
                return (gettingSubmissionByProblemID ?
                    <div className="grid content-center justify-center justify-items-center gap-3 h-screen">
                        <Loader className="size-10 animate-spin" />
                        <span>Loading Submissions...</span>
                    </div>
                    :
                    submissionsByProblemID.length === 0 ?
                        <div className="p-2">
                            <span>No Submissions Found</span>
                        </div>
                        :
                        <SubmissionList submissions={submissionsByProblemID} updateCode={setCode} setSelectedLanguage={setSelectedLanguage} />
                )

            case "hints":
                return (
                    <div className="p-2">
                        <span>{problem.hints ? problem.hints : "No Hints Found"}</span>
                    </div>
                )

            case "solution":
                console.log(solvedProblems)
                return (
                    <div className="p-2">
                        <p className="pb-4 opacity-60">{isProblemSolved ? "" : "Submit your code before accessing solutions"}</p>
                        {/* show soln only if problem submitted at least once */}
                        <span>{problem.referenceSolutions && Object.keys(problem.referenceSolutions).length !== 0 ?
                            <>
                                {Object.keys(problem.referenceSolutions).map(
                                    (lang, idx) => (
                                        <div
                                            key={lang}
                                            className=" cursor-pointer hover:bg-base-300 bg-base-200 p-6 rounded-xl mb-6 font-mono shadow-lg"
                                            title="View in Editor"
                                            onClick={() => {
                                                if (isProblemSolved) {
                                                    setSelectedLanguage(lang);
                                                    setCode(problem.referenceSolutions[lang]);
                                                }
                                            }}
                                        >
                                            <div className="flex justify-between">
                                                <div className="text-indigo-500 text-base font-semibold">
                                                    {lang}
                                                </div>
                                                <div>
                                                    {isProblemSolved ? (
                                                        <LockKeyholeOpen className="text-success w-4 h-4" />
                                                    ) : (
                                                        <LockKeyhole className="text-error w-4 h-4" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </>
                            :
                            "No Solution Found"}</span>
                    </div>
                )
            default:
                break;
        }
    }
    // if problem is loading
    if (isProblemLoading) {
        return (
            <div className="grid content-center justify-center justify-items-center gap-3 h-screen">
                <Loader className="size-10 animate-spin" />
                <span>Loading Problem...</span>
            </div>
        );
    }

    // if no such problem exists in db, problem: null
    if (!problem) {
        return (
            <div className="grid justify-center justify-items-center content-center gap-5 h-screen pt-4">
                <span className="text-2xl">Problem Not Found</span>
                <button onClick={() => navigate("/")} className="btn btn-primary">
                    Go back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-300 to-base-200 w-full">
            <nav className="container mx-auto p-4 pt-6">
                <div className="flex items-center gap-1 pb-2">
                    <Home
                        onClick={() => navigate("/")}
                        className="cursor-pointer w-4 h-4"
                    />
                    <ChevronRight
                        onClick={() => navigate("/")}
                        className="cursor-pointer w-4 h-4"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-2xl font-bold">{problem.title}</span>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center">
                                <Clock className="w-4 h-4" />
                                <span className="ml-1">Updated {new Date(problem.updatedAt).toLocaleString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}</span>
                            </div>
                            <div className="flex items-center">
                                <Users className="w-4 h-4" />
                                <div className="ml-1 flex items-center gap-1">
                                    {gettingProblemSubCountByAllUser ?
                                        <Loader className="w-4 h-4 animate-spin" />
                                        :
                                        problemSubmissionCountByAllUser
                                    }
                                    <span>Submissions</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <ThumbsUp className="w-4 h-4" />
                                <span className="ml-1">{successRateOfProblem}% Success Rate</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Bookmark className="w-[50px] h-[50px]" />
                        <Share2 className="w-[50px] h-[50px]" />
                        {/* Options to select language of editor */}
                        <select
                            className="select select-primary"
                            name="selectedLanguage"
                            id="selectedLanguage"
                            value={selectedLanguage}
                            defaultValue={Object.keys(problem.codeSnippets)[0]}
                            onChange={(e) => {
                                setSelectedLanguage(e.target.value)
                                setCode(problem.codeSnippets[e.target.value])  // updating editor code as well
                            }}
                        >
                            {/* get languages from problem data */}
                            {Object.keys(problem.codeSnippets).map((language) => {
                                return <option key={language} value={language}>{language}</option>;
                            })}
                        </select>
                        <select name="EditorTheme" className="select select-primary" id="editorTheme" value={editorTheme} onChange={(e) => setEditorTheme(e.target.value)}>
                            <option value="vs-dark">VS-Dark</option>
                            <option value="light">Light</option>
                            <option value="hc-black">HC-Black</option>
                        </select>
                    </div>
                </div>
            </nav>
            {/* Nav ended ---------- Starting main page */}
            <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* COl 1 */}
                    <div className="card bg-base-100 shadow-xl p-2">
                        <div className="card-body p-0">
                            {/* Tabs buttons */}
                            <div className="tabs tabs-bordered border-b-1 border-b-gray-200">
                                <button
                                    className={`tab ${activeTab === "description" && "tab-active"} gap-2`}
                                    onClick={() => setActiveTab("description")}
                                >
                                    <FileText className="w-4 h-4" />
                                    Description
                                </button>

                                <button
                                    className={`tab ${activeTab === "submissions" && "tab-active"} gap-2`}
                                    onClick={() => setActiveTab("submissions")}
                                >
                                    <Code2 className="w-4 h-4" />
                                    Submissions
                                </button>
                                <button
                                    className={`tab gap-2 ${activeTab === "solution" && "tab-active"}`}
                                    onClick={() => setActiveTab("solution")}
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    Solutions
                                </button>
                                <button
                                    className={`tab gap-2 ${activeTab === "hints" && "tab-active"}`}
                                    onClick={() => setActiveTab("hints")}
                                >
                                    <Lightbulb className="w-4 h-4" />
                                    Hints
                                </button>
                            </div>
                            {/* Tab infos using a utility function */}
                            <div className="px-6 pb-6 pt-2 h-[83vh] overflow-y-scroll">{renderTabContent()}</div>
                        </div>
                    </div>
                    {/* COl 2 */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body p-0">
                            <div className="tabs tabs-bordered">
                                <button className="tab tab-active gap-2">
                                    <Terminal className="w-4 h-4" />
                                    Code Editor
                                </button>
                            </div>
                            <div className="h-[68vh] w-full">
                                < Editor
                                    height="100%"
                                    value={code}
                                    theme={editorTheme}
                                    language={selectedLanguage.toLowerCase()}
                                    options={EditorOptions}
                                    onChange={(value) => setCode(value || "")}
                                    automaticLayout={true}
                                />
                            </div>
                            <div className="pb-5 px-2">
                                <div className="flex justify-between items-center">
                                    <button
                                        className={`btn btn-primary gap-2`}
                                        onClick={(e) => {
                                            handleSubmit(e);
                                            setTimeout(() => {
                                                ref.current?.scrollIntoView({ behavior: 'smooth' });
                                            }, 100);
                                        }}
                                        disabled={isExecutingCode}
                                    >
                                        {isExecutingCode ?
                                            <>
                                                <Loader className="w-4 h-4" />
                                                <span>Submitting...</span>
                                            </>
                                            :
                                            `Submit Solution`}

                                    </button>
                                    <button
                                        className={`btn btn-secondary gap-2`}
                                        onClick={(e) => {
                                            handleRunCode(e);
                                            setTimeout(() => {
                                                ref.current?.scrollIntoView({ behavior: 'smooth' });
                                            }, 100);
                                        }}
                                        disabled={isRunningCode}
                                    >
                                        {isRunningCode ?
                                            <>
                                                <Loader className="w-4 h-4" />
                                                <span>Executing...</span>
                                            </>
                                            :
                                            `Test Code`}

                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Editor and content ended ---------- Result + testcase area */}
            <div ref={ref} className="container mx-auto card bg-base-100 shadow-xl my-6">
                <div className="card-body">
                    {(isExecutingCode || isRunningCode) ?
                        <div className="flex items-center gap-2 justify-center">
                            <Loader className="w-6 h-6 animate-spin" />
                            <span className="text-lg">Executing...</span>
                        </div>
                        :
                        executionResult ? (
                            <SubmissionResult submission={executionResult} />
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold">Test Cases</h3>
                                </div>
                                <div>
                                    <table className="table table-zebra w-full">
                                        <thead>
                                            <tr>
                                                <th>Input</th>
                                                <th>Expected Output</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {testcases.map((testCase, index) => (
                                                <tr key={index}>
                                                    <td className="font-mono">{testCase.input}</td>
                                                    <td className="font-mono">{testCase.output}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                </div>
            </div>
        </div >
    );
};

export default ProblemPage;
