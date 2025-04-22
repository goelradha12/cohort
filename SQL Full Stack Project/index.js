import  express from "express"
import dotenv from "dotenv"

const app = express();
dotenv.config();


console.log("App started")
app.get("/",()=>{
    console.log("Listening to the port: ")
})