// Must be first: loads .env before any other module reads process.env.
import "./config/env.js"
import express from "express"
import authRoutes from "./routes/auth.routes.js"
import problemRoutes from "./routes/problem.routes.js"
import executionRoutes from "./routes/executeCode.routes.js"
import submissionRoutes from "./routes/submission.routes.js"
import playlistRoutes from "./routes/playlist.routes.js"
import leaderboardRoutes from "./routes/leaderboard.routes.js"
import companyRoutes from "./routes/company.routes.js"
import languageRoutes from "./routes/language.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import { errorHandler } from "./middlewares/error.middleware.js"

const app = express();

// Behind a reverse proxy in production (split domains over HTTPS): trust the
// proxy so secure cookies are set and req.ip reflects the real client (used by
// the auth rate limiter).
if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

// Allowed browser origins. BASE_URL is the production frontend
// (e.g. https://leetcode.radhagoyal.in); localhost stays for dev. Falsy values
// are filtered so an unset BASE_URL doesn't break CORS.
const allowedOrigins = ["https://leetcode.radhagoyal.in", "http://localhost:5173"].filter(Boolean);
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("I am here")
})

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/problems",problemRoutes)
app.use("/api/v1/execute-code", executionRoutes)
app.use("/api/v1/submission", submissionRoutes)
app.use("/api/v1/playlist", playlistRoutes)
app.use("/api/v1/leaderboard", leaderboardRoutes)
app.use("/api/v1/companies", companyRoutes)
app.use("/api/v1/languages", languageRoutes)

// Global error handler must be registered after all routes (remediation item 7).
app.use(errorHandler)

app.listen(PORT,()=>{
    if (process.env.NODE_ENV !== "test") {
        console.info("Backend server started", { port: PORT })
    }
})