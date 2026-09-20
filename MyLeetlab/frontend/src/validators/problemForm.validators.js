import { z } from "zod";

// Supported language keys. The backend (judge0lib, exposed via GET /languages)
// is the source of truth; this mirrors it for synchronous Zod validation. The
// admin UI's language list is driven by the /languages fetch, so this only acts
// as a guard against unsupported keys.
const SUPPORTED_LANGUAGE_KEYS = ["C", "CPP", "PYTHON", "JAVA", "JAVASCRIPT"];

const exampleEntrySchema = z.object({
    input: z.string().min(1, "Input is required"),
    output: z.string().min(1, "Output is required"),
    explanation: z.string().optional(),
});

// A record keyed by supported language. `messages` provides field-specific text.
const languageRecord = (valueSchema) =>
    z
        .record(z.string(), valueSchema)
        .refine((obj) => Object.keys(obj).length >= 1, {
            message: "At least one language is required",
        })
        .refine((obj) => Object.keys(obj).every((k) => SUPPORTED_LANGUAGE_KEYS.includes(k)), {
            message: "Unsupported language key",
        });

export const CreateProblemSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must be less than 100 characters"),
    description: z
        .string()
        .min(3, "Description must be at least 3 characters")
        .max(1000, "Description must be less than 1000 characters"),
    difficulty: z
        .enum(["EASY", "MEDIUM", "HARD"], { errorMap: () => ({ message: "Difficulty must be one of EASY, MEDIUM, HARD" }) }),
    tags: z.array(z.string()).min(1, "At least one tag must be selected"),
    constraints: z.string().min(3, "Constraints must be at least 3 characters").min(1, "Constraints are required"),
    testcases: z.array(
        z.object({
            input: z.string().min(1, "Input is required"),
            output: z.string().min(1, "Output is required")
        })
    )
        .min(1, "At least one testcase is required"),
    // Per-language maps over a dynamic subset of supported languages (>=1).
    examples: languageRecord(exampleEntrySchema),
    codeSnippets: languageRecord(z.string().min(1, "Code snippet is required")),
    referenceSolutions: languageRecord(z.string().min(1, "Reference solution is required")),
    hints: z.string(),
    editorial: z.string(),
    // Optional list of companies where the problem was seen. When present, every
    // entry requires all three fields. Year is handled carefully so an empty
    // <input type="number"> fails validation instead of coercing to 0.
    companies: z
        .array(
            z.object({
                companyId: z.string().min(1, "Select a company"),
                year: z
                    .preprocess(
                        // Empty string / null / undefined -> NaN, which fails the number check
                        // below with a clear message instead of silently becoming 0.
                        (val) => {
                            if (val === "" || val === null || val === undefined) return NaN;
                            return Number(val);
                        },
                        z
                            .number({ invalid_type_error: "Year is required" })
                            .int("Year must be a whole number")
                            .min(1970, "Year must be 1970 or later")
                            .max(new Date().getFullYear() + 1, "Year is out of range")
                    ),
                context: z.string().min(1, "Context is required"),
            })
        )
        .optional(),
}).superRefine((data, ctx) => {
    // Every language that has a starter snippet must also have a reference
    // solution and an example, so the set of selected languages is consistent.
    const snippetLangs = Object.keys(data.codeSnippets || {});
    snippetLangs.forEach((lang) => {
        if (!data.referenceSolutions || !(lang in data.referenceSolutions)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["referenceSolutions", lang],
                message: `Reference solution required for ${lang}`,
            });
        }
        if (!data.examples || !(lang in data.examples)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["examples", lang],
                message: `Example required for ${lang}`,
            });
        }
    });
})