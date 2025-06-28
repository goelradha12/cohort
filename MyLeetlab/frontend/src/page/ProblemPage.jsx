import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useProblemStore } from "../store/useProblemStore.js";
import {
    ArrowBigLeft,
    Bookmark,
    BookmarkIcon,
    ChevronRight,
    Clock,
    Home,
    Loader,
    Share,
    Share2,
    ShareIcon,
    Terminal,
    ThumbsUp,
    Users,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";
import Editor from '@monaco-editor/react';
import { EditorOptions } from "../components/EditorOptions.js";

const ProblemPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { isProblemLoading, problem, getProblemById } = useProblemStore();
    const { authUser } = useAuthStore();

    useEffect(() => {
        getProblemById(id);
        // console.log(`AuthUser: ${JSON.stringify(authUser)}, Problem: ${problem}`)
    }, [id]);

    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [editorTheme, setEditorTheme] = useState("vs-dark");
    const [code, setCode] = useState("");
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

    {
        console.log(problem);
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-base-300 to-base-200 w-full">
            <nav className="container mx-auto p-4">
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
                                <span className="ml-1">{10} Submissions</span>
                            </div>
                            <div className="flex items-center">
                                <ThumbsUp className="w-4 h-4" />
                                <span className="ml-1">{95}% Success Rate</span>
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
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                        >
                            {/* get languages from problem data */}
                            {Object.keys(problem.codeSnippets).map((language) => {
                                return <option value={language}>{language}</option>;
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
                    <div className="card bg-base-100 shadow-xs">Col 1</div>
                    <div className="card bg-base-100 shadow-xs">
                        <div className="card-body p-0">
                            <div className="tabs tabs-bordered">
                                <button className="tab tab-active gap-2">
                                    <Terminal className="w-4 h-4" />
                                    Code Editor
                                </button>
                            </div>
                            <div className="h-[600px] w-full">
                                < Editor
                                    height="100%"
                                    language = {selectedLanguage.toLowerCase()}
                                    options={EditorOptions}
                                    theme={editorTheme}
                                    value={code}
                                    onChange={(value) => setCode(value || "")}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemPage;
