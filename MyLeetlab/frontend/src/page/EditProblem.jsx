import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useProblemStore } from "../store/useProblemStore";
import {
    BookOpen,
    BrushCleaning,
    Building2,
    CheckCircle2,
    ChevronRight,
    Code2,
    Edit3,
    FileText,
    Home,
    Lightbulb,
    Loader,
    Plus,
    Trash2,
} from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateProblemSchema } from "../validators/problemForm.validators";
import { Editor } from "@monaco-editor/react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useCompanyStore } from "../store/useCompanyStore";
import { CompanyCombobox } from "../components/CreateProblemForm.jsx";
import { INTERVIEW_CONTEXTS } from "../lib/interviewContexts.js";
import { useLanguageStore } from "../store/useLanguageStore";
import { getMonacoLanguage } from "../lib/utilFunctions";

const EditProblem = () => {
    const navigation = useNavigate();
    const id = useParams().id;
    const { isProblemLoading, problem, getProblemById } = useProblemStore();
    useEffect(() => {
        getProblemById(id);
    }, []);

    useEffect(() => {
        if (problem) {
            handleReset();
            console.log(problem)
        }
    }, [problem]);

    const {
        register,
        control,
        handleSubmit,
        reset,
        setValue,
        unregister,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(CreateProblemSchema),
        defaultValues: {
            testcases: [
                {
                    input: "",
                    output: "",
                },
            ],
            tags: [""],
            examples: {
                JAVASCRIPT: {
                    input: "",
                    output: "",
                    explanation: "",
                },
                PYTHON: {
                    input: "",
                    output: "",
                    explanation: "",
                },
                JAVA: {
                    input: "",
                    output: "",
                    explanation: "",
                },
            },
            codeSnippets: {
                JAVASCRIPT: "function solution() {\n  // Write your code here\n}",
                PYTHON: "def solution():\n    # Write your code here\n    pass",
                JAVA: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
            },
            referenceSolutions: {
                JAVASCRIPT: "// Add your reference solution here",
                PYTHON: "# Add your reference solution here",
                JAVA: "// Add your reference solution here",
            },
            hints: "",
            editorial: "",
            companies: []
        },
    });

    const {
        fields: testCaseFields,
        append: appendTestCase,
        remove: removeTestCase,
        replace: replacetestcases,
    } = useFieldArray({
        control,
        name: "testcases",
    });

    const {
        fields: tagFields,
        append: appendTag,
        remove: removeTag,
        replace: replaceTags,
    } = useFieldArray({
        control,
        name: "tags",
    });

    const {
        fields: companyFields,
        append: appendCompany,
        remove: removeCompany,
        replace: replaceCompanies,
    } = useFieldArray({
        control,
        name: "companies",
    });

    const { companies: companyOptions, fetchCompanies, createCompany, isCreatingCompany } = useCompanyStore();
    const { languages: supportedLanguages, fetchLanguages } = useLanguageStore();
    useEffect(() => {
        fetchCompanies();
        fetchLanguages();
    }, []);

    // Languages this problem supports — initialized from the problem's JSON keys
    // in handleReset(), then editable via add/remove.
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [languageToAdd, setLanguageToAdd] = useState("");

    const availableToAdd = supportedLanguages.filter((l) => !selectedLanguages.includes(l.key));
    const labelFor = (key) => supportedLanguages.find((l) => l.key === key)?.label || key;

    const addLanguage = () => {
        if (!languageToAdd || selectedLanguages.includes(languageToAdd)) return;
        setSelectedLanguages((prev) => [...prev, languageToAdd]);
        setValue(`codeSnippets.${languageToAdd}`, "");
        setValue(`referenceSolutions.${languageToAdd}`, "");
        setValue(`examples.${languageToAdd}`, { input: "", output: "", explanation: "" });
        setLanguageToAdd("");
    };

    const removeLanguage = (key) => {
        setSelectedLanguages((prev) => prev.filter((l) => l !== key));
        unregister(`codeSnippets.${key}`);
        unregister(`referenceSolutions.${key}`);
        unregister(`examples.${key}`);
    };

    const [isLoading, setIsLoading] = useState(false);

    async function onSubmit(data) {
        try {
            setIsLoading(true);
            const response = await axiosInstance.put(`/problems/${id}`, data);
            toast.success(response?.data?.message || "Problem edited successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Error editing problem");
        } finally {
            setIsLoading(false);
            await getProblemById(id);
        }
    }

    function onError() {
        toast.error("Please fix form errors before submitting.");
    }
    function handleReset() {
        // Normalize a null companies column to [] so the field array works and
        // year values render in the number inputs.
        const normalizedCompanies = Array.isArray(problem.companies)
            ? problem.companies.map((c) => ({
                companyId: c.companyId ?? "",
                year: c.year ?? "",
                context: c.context ?? "",
            }))
            : [];
        reset({ ...problem, companies: normalizedCompanies });
        replacetestcases(problem.testcases);
        replaceTags(problem.tags);
        replaceCompanies(normalizedCompanies);
        // Initialize selected languages from the problem's actual code snippet keys.
        const langs = Object.keys(problem.codeSnippets || {});
        setSelectedLanguages(langs);
    }
    if (isProblemLoading) {
        return (
            <div className="grid content-center justify-center justify-items-center gap-3 h-screen">
                <Loader className="w-4 h-4 animate-spin" />
                <span>Loading Problem...</span>
            </div>
        );
    }

    // if no such problem exists in db, problem: null
    if (!problem) {
        return (
            <div className="grid justify-center justify-items-center content-center gap-5 h-screen pt-4">
                <span className="text-2xl">Problem Not Found</span>
                <button onClick={() => navigation("/")} className="btn btn-primary">
                    Go back to Home
                </button>
            </div>
        );
    }
    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            {/* Navigation: Breadcrumb */}
            <div className="card mx-auto p-4">
                <div className="flex items-center gap-1 pb-2">
                    <Home
                        onClick={() => navigation("/")}
                        className="cursor-pointer w-4 h-4"
                    />
                    <ChevronRight
                        onClick={() => navigation("/")}
                        className="cursor-pointer w-4 h-4"
                    />
                    <span className="font-normal">Edit Problem</span>
                </div>
            </div>
            {/* Problem Form starts */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body p-6 pt-10 md:p-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 pb-4 border-b">
                        <h2 className="card-title text-2xl md:text-3xl flex items-center gap-3">
                            <Edit3 className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                            Edit Problem
                        </h2>
                    </div>

                    {/* Form Starts */}
                    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-8" id="editProblemForm">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-control md:col-span-2">
                                <label className="label">
                                    <span className="label-text text-base md:text-lg font-semibold">
                                        Title
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full text-base md:text-lg"
                                    {...register("title")}
                                    placeholder="Enter problem title"
                                />
                                {errors.title && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">
                                            {errors.title.message}
                                        </span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control md:col-span-2">
                                <label className="label">
                                    <span className="label-text text-base md:text-lg font-semibold">
                                        Description
                                    </span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered min-h-32 w-full text-base md:text-lg p-4 resize-y"
                                    {...register("description")}
                                    placeholder="Enter problem description"
                                />
                                {errors.description && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">
                                            {errors.description.message}
                                        </span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-base md:text-lg font-semibold">
                                        Difficulty
                                    </span>
                                </label>
                                <select
                                    className="select select-bordered w-full text-base md:text-lg"
                                    {...register("difficulty")}
                                >
                                    <option value="EASY">Easy</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HARD">Hard</option>
                                </select>
                                {errors.difficulty && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">
                                            {errors.difficulty.message}
                                        </span>
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="card bg-base-200 p-4 md:p-6 shadow-md">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" />
                                    Tags
                                </h3>
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={() => appendTag("")}
                                >
                                    <Plus className="w-4 h-4 mr-1" /> Add Tag
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {tagFields.map((field, index) => (
                                    <div key={field.id} className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            className="input input-bordered flex-1"
                                            {...register(`tags.${index}`)}
                                            placeholder="Enter tag"
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-ghost btn-square btn-sm"
                                            onClick={() => removeTag(index)}
                                            disabled={tagFields.length === 1}
                                        >
                                            <Trash2 className="w-4 h-4 text-error" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {errors.tags && (
                                <div className="mt-2">
                                    <span className="text-error text-sm">
                                        {errors.tags.message}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Test Cases */}
                        <div className="card bg-base-200 p-4 md:p-6 shadow-md">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5" />
                                    Test Cases
                                </h3>
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={() => appendTestCase({ input: "", output: "" })}
                                >
                                    <Plus className="w-4 h-4 mr-1" /> Add Test Case
                                </button>
                            </div>
                            <div className="space-y-6">
                                {testCaseFields.map((field, index) => (
                                    <div key={field.id} className="card bg-base-100 shadow-md">
                                        <div className="card-body p-4 md:p-6">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="text-base md:text-lg font-semibold">
                                                    Test Case #{index + 1}
                                                </h4>
                                                <button
                                                    type="button"
                                                    className="btn btn-ghost btn-sm text-error"
                                                    onClick={() => removeTestCase(index)}
                                                    disabled={testCaseFields.length === 1}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-1" /> Remove
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text font-medium">
                                                            Input
                                                        </span>
                                                    </label>
                                                    <textarea
                                                        className="textarea textarea-bordered min-h-24 w-full p-3 resize-y"
                                                        {...register(`testcases.${index}.input`)}
                                                        placeholder="Enter test case input"
                                                    />
                                                    {errors.testcases?.[index]?.input && (
                                                        <label className="label">
                                                            <span className="label-text-alt text-error">
                                                                {errors.testcases[index].input.message}
                                                            </span>
                                                        </label>
                                                    )}
                                                </div>
                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text font-medium">
                                                            Expected Output
                                                        </span>
                                                    </label>
                                                    <textarea
                                                        className="textarea textarea-bordered min-h-24 w-full p-3 resize-y"
                                                        {...register(`testcases.${index}.output`)}
                                                        placeholder="Enter expected output"
                                                    />
                                                    {errors.testcases?.[index]?.output && (
                                                        <label className="label">
                                                            <span className="label-text-alt text-error">
                                                                {errors.testcases[index].output.message}
                                                            </span>
                                                        </label>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {errors.testcases && !Array.isArray(errors.testcases) && (
                                <div className="mt-2">
                                    <span className="text-error text-sm">
                                        {errors.testcases.message}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Companies (optional) — where this problem was seen */}
                        <div className="card bg-base-200 p-4 md:p-6 shadow-md">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                                    <Building2 className="w-5 h-5" />
                                    Companies <span className="text-sm font-normal opacity-60">(optional)</span>
                                </h3>
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={() => appendCompany({ companyId: "", year: "", context: "" })}
                                >
                                    <Plus className="w-4 h-4 mr-1" /> Add Company
                                </button>
                            </div>
                            {/* Suggestions for the free-text context field (reference only). */}
                            <datalist id="interview-contexts">
                                {INTERVIEW_CONTEXTS.map((ctx) => (
                                    <option key={ctx} value={ctx} />
                                ))}
                            </datalist>
                            <div className="space-y-6">
                                {companyFields.map((field, index) => (
                                    <div key={field.id} className="card bg-base-100 shadow-md">
                                        <div className="card-body p-4 md:p-6">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="text-base md:text-lg font-semibold">
                                                    Company #{index + 1}
                                                </h4>
                                                <button
                                                    type="button"
                                                    className="btn btn-ghost btn-sm text-error"
                                                    onClick={() => removeCompany(index)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-1" /> Remove
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text font-medium">Company</span>
                                                    </label>
                                                    <Controller
                                                        control={control}
                                                        name={`companies.${index}.companyId`}
                                                        render={({ field: { value, onChange } }) => (
                                                            <CompanyCombobox
                                                                value={value}
                                                                onChange={onChange}
                                                                options={companyOptions}
                                                                onCreate={createCompany}
                                                                isCreating={isCreatingCompany}
                                                            />
                                                        )}
                                                    />
                                                    {errors.companies?.[index]?.companyId && (
                                                        <label className="label">
                                                            <span className="label-text-alt text-error">
                                                                {errors.companies[index].companyId.message}
                                                            </span>
                                                        </label>
                                                    )}
                                                </div>
                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text font-medium">Year</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="input input-bordered w-full"
                                                        {...register(`companies.${index}.year`)}
                                                        placeholder="e.g. 2023"
                                                    />
                                                    {errors.companies?.[index]?.year && (
                                                        <label className="label">
                                                            <span className="label-text-alt text-error">
                                                                {errors.companies[index].year.message}
                                                            </span>
                                                        </label>
                                                    )}
                                                </div>
                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text font-medium">Context</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        list="interview-contexts"
                                                        className="input input-bordered w-full"
                                                        {...register(`companies.${index}.context`)}
                                                        placeholder="e.g. Technical round 1"
                                                    />
                                                    {errors.companies?.[index]?.context && (
                                                        <label className="label">
                                                            <span className="label-text-alt text-error">
                                                                {errors.companies[index].context.message}
                                                            </span>
                                                        </label>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {companyFields.length === 0 && (
                                    <p className="text-sm opacity-60">
                                        No companies added. This is optional.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Language selection */}
                        <div className="card bg-base-200 p-4 md:p-6 shadow-md">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                                    <Code2 className="w-5 h-5" />
                                    Languages <span className="text-sm font-normal opacity-60">({selectedLanguages.length} selected)</span>
                                </h3>
                                <div className="flex items-center gap-2">
                                    <select
                                        className="select select-bordered select-sm"
                                        value={languageToAdd}
                                        onChange={(e) => setLanguageToAdd(e.target.value)}
                                        disabled={availableToAdd.length === 0}
                                    >
                                        <option value="">
                                            {availableToAdd.length === 0 ? "All languages added" : "Select a language"}
                                        </option>
                                        {availableToAdd.map((l) => (
                                            <option key={l.key} value={l.key}>{l.label}</option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-sm"
                                        onClick={addLanguage}
                                        disabled={!languageToAdd}
                                    >
                                        <Plus className="w-4 h-4 mr-1" /> Add Language
                                    </button>
                                </div>
                            </div>
                            {selectedLanguages.length === 0 && (
                                <p className="text-error text-sm mt-2">At least one language is required.</p>
                            )}
                        </div>

                        {/* Code Editor Sections (one per selected language) */}
                        <div className="space-y-8">
                            {selectedLanguages.map((language) => (
                                <div
                                    key={language}
                                    className="card bg-base-200 p-4 md:p-6 shadow-md"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                                            <Code2 className="w-5 h-5" />
                                            {labelFor(language)}
                                        </h3>
                                        <button
                                            type="button"
                                            className="btn btn-ghost btn-sm text-error"
                                            onClick={() => removeLanguage(language)}
                                            disabled={selectedLanguages.length === 1}
                                            title={selectedLanguages.length === 1 ? "At least one language is required" : "Remove language"}
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" /> Remove
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Starter Code */}
                                        <div className="card bg-base-100 shadow-md">
                                            <div className="card-body p-4 md:p-6">
                                                <h4 className="font-semibold text-base md:text-lg mb-4">
                                                    Starter Code Template
                                                </h4>
                                                <div className="border rounded-md overflow-hidden">
                                                    <Controller
                                                        name={`codeSnippets.${language}`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Editor
                                                                height="300px"
                                                                language={getMonacoLanguage(language)}
                                                                theme="vs-dark"
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                options={{
                                                                    minimap: { enabled: false },
                                                                    fontSize: 14,
                                                                    lineNumbers: "on",
                                                                    roundedSelection: false,
                                                                    scrollBeyondLastLine: false,
                                                                    automaticLayout: true,
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                                {errors.codeSnippets?.[language] && (
                                                    <div className="mt-2">
                                                        <span className="text-error text-sm">
                                                            {errors.codeSnippets[language].message}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Reference Solution */}
                                        <div className="card bg-base-100 shadow-md">
                                            <div className="card-body p-4 md:p-6">
                                                <h4 className="font-semibold text-base md:text-lg mb-4 flex items-center gap-2">
                                                    <CheckCircle2 className="w-5 h-5 text-success" />
                                                    Reference Solution
                                                </h4>
                                                <div className="border rounded-md overflow-hidden">
                                                    <Controller
                                                        name={`referenceSolutions.${language}`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Editor
                                                                height="300px"
                                                                language={getMonacoLanguage(language)}
                                                                theme="vs-dark"
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                options={{
                                                                    minimap: { enabled: false },
                                                                    fontSize: 14,
                                                                    lineNumbers: "on",
                                                                    roundedSelection: false,
                                                                    scrollBeyondLastLine: false,
                                                                    automaticLayout: true,
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                                {errors.referenceSolutions?.[language] && (
                                                    <div className="mt-2">
                                                        <span className="text-error text-sm">
                                                            {errors.referenceSolutions[language].message}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Examples */}
                                        <div className="card bg-base-100 shadow-md">
                                            <div className="card-body p-4 md:p-6">
                                                <h4 className="font-semibold text-base md:text-lg mb-4">
                                                    Example
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="label-text font-medium">
                                                                Input
                                                            </span>
                                                        </label>
                                                        <textarea
                                                            className="textarea textarea-bordered min-h-20 w-full p-3 resize-y"
                                                            {...register(`examples.${language}.input`)}
                                                            placeholder="Example input"
                                                        />
                                                        {errors.examples?.[language]?.input && (
                                                            <label className="label">
                                                                <span className="label-text-alt text-error">
                                                                    {errors.examples[language].input.message}
                                                                </span>
                                                            </label>
                                                        )}
                                                    </div>
                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="label-text font-medium">
                                                                Output
                                                            </span>
                                                        </label>
                                                        <textarea
                                                            className="textarea textarea-bordered min-h-20 w-full p-3 resize-y"
                                                            {...register(`examples.${language}.output`)}
                                                            placeholder="Example output"
                                                        />
                                                        {errors.examples?.[language]?.output && (
                                                            <label className="label">
                                                                <span className="label-text-alt text-error">
                                                                    {errors.examples[language].output.message}
                                                                </span>
                                                            </label>
                                                        )}
                                                    </div>
                                                    <div className="form-control md:col-span-2">
                                                        <label className="label">
                                                            <span className="label-text font-medium">
                                                                Explanation
                                                            </span>
                                                        </label>
                                                        <textarea
                                                            className="textarea textarea-bordered min-h-24 w-full p-3 resize-y"
                                                            {...register(`examples.${language}.explanation`)}
                                                            placeholder="Explain the example"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Additional Information */}
                        <div className="card bg-base-200 p-4 md:p-6 shadow-md">
                            <h3 className="text-lg md:text-xl font-semibold mb-6 flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-warning" />
                                Additional Information
                            </h3>
                            <div className="space-y-6">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Constraints</span>
                                    </label>
                                    <textarea
                                        className="textarea textarea-bordered min-h-24 w-full p-3 resize-y"
                                        {...register("constraints")}
                                        placeholder="Enter problem constraints"
                                    />
                                    {errors.constraints && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">
                                                {errors.constraints.message}
                                            </span>
                                        </label>
                                    )}
                                </div>
                                <div className="form-control">
                                    <label className="label" for="hints">
                                        <span className="label-text font-medium">
                                            Hints (Optional)
                                        </span>
                                    </label>
                                    <Controller
                                        name="hints"
                                        control={control}
                                        defaultValue=""
                                        render={({ field }) => (
                                            <textarea
                                                {...field}
                                                defaultValue="NA"
                                                placeholder="Enter hints for solving the problem"
                                                className="textarea textarea-bordered min-h-24 w-full"
                                            />
                                        )}
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label" for="editorial">
                                        <span className="label-text font-medium">
                                            Editorial (Optional)
                                        </span>
                                    </label>
                                    <textarea
                                        className="textarea textarea-bordered min-h-32 w-full p-3 resize-y"
                                        name="editorial"
                                        defaultValue="NA"
                                        {...register("editorial")}
                                        placeholder="Enter problem editorial/solution explanation"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="card-actions justify-end pt-4 border-t">
                            <button type="submit" className="btn btn-primary btn-lg gap-2">
                                {isLoading ? (
                                    <span className="loading loading-spinner text-white"></span>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-5 h-5" />
                                        Update Problem
                                    </>
                                )}
                            </button>
                            <button type="button" onClick={handleReset} className="btn btn-outline btn-lg gap-2">
                                <BrushCleaning className="w-4 h-4" />
                                Reset
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProblem;
