import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.routes.js"
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
app.listen(3000,()=>{
    console.log(`Server is running on Port: ${PORT}`)
})