import express from "express"
import dotenv from "dotenv"
import cors from "cors"

import userRoutes from "./routes/user.router.js"
// add .js after db
import db from "./utils/db.js"
import cookieParser from "cookie-parser"


// dotenv converts .env file to the process.env

// If .env is in other folder, you can write file path in config(...)
dotenv.config();
const app = express();
const port = 3000;


db();
// send db request from this URL only
app.use(cors({
    origin: process.env.base_url
}))

// Send json format data to server
app.use(express.json());

// Sync URL encoding with backend
app.use(express.urlencoded({extended:true}));

// now we can access cookie anywhere
app.use(cookieParser()); 

// Try to check if things are working
// console.log(process.env.port);

// keeps on listening
app.listen(port,()=>{
    console.log(`Listening to port ${port}`);
})

app.get("/",(req,res)=>
{
    res.send("Hello World");
})


// You can also write #response #request
app.get("/radha",(request,response)=>{
    // if you try to console.log after sending response,
    // it's of no particular use

    response.send("Radha"+request.path);
});

// everything after this URL+/ will go to userRouter
app.use("/api/v1/users",userRoutes);
