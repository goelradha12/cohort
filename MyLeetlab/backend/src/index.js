import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.routes.js"
import problemRoutes from "./routes/problem.routes.js"
import executionRoutes from "./routes/executeCode.routes.js"
import submissionRoutes from "./routes/submission.routes.js"
import playlistRoutes from "./routes/playlist.routes.js"
import leaderboardRoutes from "./routes/leaderboard.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import { errorHandler } from "./middlewares/error.middleware.js"

const app = express();
dotenv.config();

app.use(cors({
    origin: [process.env.BASE_URL, "http://localhost:5173"],
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

// Global error handler must be registered after all routes (remediation item 7).
app.use(errorHandler)

app.listen(PORT,()=>{
    console.info("Backend server started", { port: PORT })
})