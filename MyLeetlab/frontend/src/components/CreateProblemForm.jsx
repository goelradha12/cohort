import React, { useEffect, useState } from "react";
import { CreateProblemSchema } from "../validators/problemForm.validators.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import Editor from "@monaco-editor/react";
import { sampledpData, sampleStringProblem } from "../samples/sampleProblem.js";
import { BookOpen, Building2, CheckCircle2, ChevronRight, Code2, Download, FileText, Home, Lightbulb, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { EditorOptions } from "./EditorOptions.js";
import { useCompanyStore } from "../store/useCompanyStore.js";
import { INTERVIEW_CONTEXTS } from "../lib/interviewContexts.js";
import { useLanguageStore } from "../store/useLanguageStore.js";
import { getMonacoLanguage } from "../lib/utilFunctions.js";

// Searchable company combobox. Shows existing companies matching the typed query
// and offers "Add \"<query>\" as new company" which creates it (admin-only) and
// selects the returned id. `value` is the selected companyId; `onChange(id)`.
// Exported so EditProblem can reuse it.
export const CompanyCombobox = ({ value, onChange, options, onCreate, isCreating }) => {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);

    const selected = options.find((c) => c.id === value);
    const q = query.trim().toLowerCase();
    const matches = q
        ? options.filter((c) => c.name.toLowerCase().includes(q))
        : options;
    const exactExists = options.some((c) => c.name.trim().toLowerCase() === q);

    const handleCreate = async () => {
        const name = query.trim();
        if (!name) return;
        const company = await onCreate(name);
        if (company?.id) {
            onChange(company.id);
            setQuery("");
            setOpen(false);
        }
    };

    return (
        <div className="relative">
            <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Search or add a company"
                aria-label="Company"
                value={open ? query : selected?.name ?? query}
                onFocus={() => { setOpen(true); setQuery(selected?.name ?? ""); }}
                onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
            />
            {open && (
                <ul className="menu menu-sm absolute z-20 mt-1 w-full max-h-56 overflow-y-auto bg-base-100 rounded-box shadow border border-base-300 flex-nowrap">
                    {matches.map((c) => (
                        <li key={c.id}>
                            <button
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => { onChange(c.id); setQuery(""); setOpen(false); }}
                            >
                                {c.name}
                            </button>
                        </li>
                    ))}
                    {q && !exactExists && (
                        <li>
                            <button
                                type="button"
                                className="text-primary"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={handleCreate}
                                disabled={isCreating}
                            >
                                {isCreating ? "Adding..." : `Add "${query.trim()}" as new company`}
                            </button>
                        </li>
                    )}
                    {matches.length === 0 && !q && (
                        <li className="disabled"><span>No companies yet — type to add one</span></li>
                    )}
                </ul>
            )}
        </div>
    );
};

const CreateProblemForm = () => {
    const [sampleType, setSampleType] = useState("DP");
    const [isInputByObject, setIsInputByObject] = useState(false);
    const [inputByObject, setInputByObject] = useState("");
    const navigation = useNavigate();

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
            // Defaults cover only the initially-selected language (JavaScript).
            // Adding a language seeds its own fields via addLanguage().
            examples: {
                JAVASCRIPT: {
                    input: "",
                    output: "",
                    explanation: "",
                },
            },
            codeSnippets: {
                JAVASCRIPT: "function solution() {\n  // Write your code here\n}",
            },
            referenceSolutions: {
                JAVASCRIPT: "// Add your reference solution here",
            },
            hints: "NA",
            editorial: "NA",
            companies: [],
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
    } = useFieldArray({
        control,
        name: "companies",
    });

    // Canonical company list for the comboboxes (shared store).
    const { companies: companyOptions, fetchCompanies, createCompany, isCreatingCompany } = useCompanyStore();
    // Supported languages from the backend (single source of truth via /languages).
    const { languages: supportedLanguages, fetchLanguages } = useLanguageStore();
    useEffect(() => {
        fetchCompanies();
        fetchLanguages();
    }, []);

    // Which languages this problem supports. Starts with JavaScript; admin can
    // add/remove any supported language. Each language keeps its own code data.
    const [selectedLanguages, setSelectedLanguages] = useState(["JAVASCRIPT"]);
    const [languageToAdd, setLanguageToAdd] = useState("");

    // Languages not yet added (for the "Add language" selector).
    const availableToAdd = supportedLanguages.filter((l) => !selectedLanguages.includes(l.key));
    const labelFor = (key) => supportedLanguages.find((l) => l.key === key)?.label || key;

    const addLanguage = () => {
        if (!languageToAdd || selectedLanguages.includes(languageToAdd)) return;
        setSelectedLanguages((prev) => [...prev, languageToAdd]);
        // Seed empty fields for the new language so RHF registers them.
        setValue(`codeSnippets.${languageToAdd}`, "");
        setValue(`referenceSolutions.${languageToAdd}`, "");
        setValue(`examples.${languageToAdd}`, { input: "", output: "", explanation: "" });
        setLanguageToAdd("");
    };

    const removeLanguage = (key) => {
        setSelectedLanguages((prev) => prev.filter((l) => l !== key));
        // Drop that language's data so it isn't submitted.
        unregister(`codeSnippets.${key}`);
        unregister(`referenceSolutions.${key}`);
        unregister(`examples.${key}`);
    };

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (value) => {
        try {
            setIsLoading(true)
            const res = await axiosInstance.post("/problems/create-problem", value)
            // console.log(res.data);
            toast.success(res.data.message || "Problem Created successfully⚡");
            navigation("/");

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Error creating problem")
        }
        finally {
            setIsLoading(false);
        }
    }

    const loadSampleData = () => {
        try {
            const sampleData = sampleType === "New"
                ? JSON.parse(inputByObject)
                : sampleType === "DP" ? sampledpData : sampleStringProblem;

            if (!sampleData || typeof sampleData !== "object" || Array.isArray(sampleData)) {
                throw new Error("JSON must contain one problem object");
            }

            if (!Array.isArray(sampleData.tags) || !Array.isArray(sampleData.testcases)) {
                throw new Error("JSON must include tags and testcases arrays");
            }

            const normalizedData = {
                ...sampleData,
                tags: sampleData.tags.map(String),
                testcases: sampleData.testcases.map((testcase) => ({
                    ...testcase,
                    input: String(testcase.input ?? ""),
                    output: String(testcase.output ?? ""),
                })),
                examples: Object.fromEntries(
                    Object.entries(sampleData.examples ?? {}).map(([language, example]) => [language, {
                        ...example,
                        input: String(example.input ?? ""),
                        output: String(example.output ?? ""),
                        explanation: String(example.explanation ?? ""),
                    }])
                ),
            };

            reset(normalizedData);
            replaceTags(normalizedData.tags);
            replacetestcases(normalizedData.testcases);
            // Sync selected languages from the loaded code snippets' keys.
            const loadedLangs = Object.keys(normalizedData.codeSnippets || {});
            if (loadedLangs.length > 0) setSelectedLanguages(loadedLangs);
            setIsInputByObject(false);
            toast.success("JSON loaded into the form");
        } catch (error) {
            console.error("Could not load problem JSON:", error);
            toast.error(error.message || "Invalid problem JSON");
        }
    }
    return (
        <div className='container mx-auto py-8 px-4 max-w-7xl'>
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
                    <span
                        className="cursor-pointer font-normal"
                    >
                        Create Problem
                    </span>
                </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body p-6 pt-10 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 pb-4 border-b">
                        <h2 className="card-title text-2xl md:text-3xl flex items-center gap-3">
                            <FileText className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                            Create Problem
                        </h2>

                        <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0">
                            <div className="join">
                                <button
                                    type="button"
                                    className={`btn join-item ${sampleType === "New" ? "btn-active" : ""
                                        }`}
                                    onClick={() => { setSampleType("New"); setIsInputByObject(true) }}
                                >
                                    Add By JSON
                                </button>
                                <button
                                    type="button"
                                    className={`btn join-item ${sampleType === "DP" ? "btn-active" : ""
                                        }`}
                                    onClick={() => setSampleType("DP")}
                                >
                                    DP Problem
                                </button>
                                <button
                                    type="button"
                                    className={`btn join-item ${sampleType === "string" ? "btn-active" : ""
                                        }`}
                                    onClick={() => setSampleType("string")}
                                >
                                    String Problem
                                </button>
                            </div>
                            <button
                                type="button"
                                className="btn btn-secondary gap-2"
                                onClick={loadSampleData}
                            >
                                <Download className="w-4 h-4" />
                                Load Sample
                            </button>
                        </div>
                    </div>

                    {isInputByObject
                        &&
                        <>
                        <label htmlFor="input-by-object" className="label">Enter Your JSON</label>
                            <textarea 
                                className="input w-full h-32 p-2"
                                name="input-by-object"
                                placeholder="Enter JSON within curly braces and click on 'load sample'"
                                value={inputByObject}
                                onChange={(e) => setInputByObject(e.target.value)}
                            >
                            </textarea>
                        </>
                    }
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
                                                                options={EditorOptions}
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
                                                                options={EditorOptions}
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
                                    <label className="label">
                                        <span className="label-text font-medium">
                                            Hints (Optional)
                                        </span>
                                    </label>
                                    <textarea
                                        className="textarea textarea-bordered min-h-24 w-full p-3 resize-y"
                                        {...register("hints")}
                                        placeholder="Enter hints for solving the problem"
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">
                                            Editorial (Optional)
                                        </span>
                                    </label>
                                    <textarea
                                        className="textarea textarea-bordered min-h-32 w-full p-3 resize-y"
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
                                        Create Problem
                                    </>
                                )}
                            </button>
                            <button type="reset" className="btn btn-outline btn-lg gap-2 ml-2"
                                onClick={() => reset()}>
                                Reset
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default CreateProblemForm;
