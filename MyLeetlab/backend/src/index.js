import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.routes.js"
import problemRoutes from "./routes/problem.routes.js"
import executionRoutes from "./routes/executeCode.routes.js"
import submissionRoutes from "./routes/submission.routes.js"
import playlistRoutes from "./routes/playlist.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express();
app.use(cors({
    origin: process.env.BASE_URL,
    credentials: true
}))
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
dotenv.config();

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

app.listen(3000,()=>{
    console.log(`Server is running on Port: ${PORT}`)
})