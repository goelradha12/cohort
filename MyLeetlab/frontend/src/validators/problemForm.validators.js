import { z } from "zod";

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
    examples: z.object({
        JAVASCRIPT: z.object({
            input: z.string().min(1, "Input is required"),
            output: z.string().min(1, "Output is required"),
            explanation: z.string().optional()
        }),
        PYTHON: z.object({
            input: z.string().min(1, "Input is required"),
            output: z.string().min(1, "Output is required"),
            explanation: z.string().optional()
        }),
        JAVA: z.object({
            input: z.string().min(1, "Input is required"),
            output: z.string().min(1, "Output is required"),
            explanation: z.string().optional()
        })
    }),
    codeSnippets: z.object({
        JAVASCRIPT: z.string().min(1, "Code snippet is required"),
        PYTHON: z.string().min(1, "Code snippet is required"),
        JAVA: z.string().min(1, "Code snippet is required")
    }),
    referenceSolutions: z.object({
        JAVASCRIPT: z.string().min(1, "JavaScript solution is required"),
        PYTHON: z.string().min(1, "Python solution is required"),        
        JAVA: z.string().min(1, "Java solution is required")
    })
})