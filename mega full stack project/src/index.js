import app from "../app.js"
import dotenv from "dotenv"
import connectDb from "../db/index.js"
import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

dotenv.config({path:"./.env"})
app.use(express.json());
app.use(cors({
    origin: process.env.BASE_URL
}))
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

connectDb()
.then(
    app.listen(PORT,(req,res)=>{
        console.log("I am listening here: ",PORT);
    })
)

app.get("/",(req,res)=>
{
    res.send("Hello World");
})
