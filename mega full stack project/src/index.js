import app from "../app.js"
import dotenv from "dotenv"
import connectDb from "../db/index.js"
import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import authRouter from "../routes/auth.routes.js"
import projectRouter from "../routes/project.routes.js"

dotenv.config({path:"./.env"})
app.use(express.json());
app.use(cors({
    origin: process.env.BASE_URL,
    credentials: true
}))
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

const PORT = process.env.PORT || 3000;

connectDb()
.then(
    app.listen(PORT,()=>{
        console.log("I am listening here: ",PORT);
    })
)

app.get("/",(req,res)=>
{
    res.send("Hello World");
    console.log(req.body)
})
app.use("/api/v1/users",authRouter)
app.use("/project",projectRouter)