import  express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors"
import userRouter from "./routes/auth.route.js";


dotenv.config();
const app = express();
const port = process.env.port || "3000";


app.use(cookieParser())
app.use(cors({
    origin: process.env.BASE_URL,
}))
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.listen(port,()=>{
    console.log(`Listening at port ,${port}`);
})

app.use('/api/v1/users',userRouter);

console.log("App started")

app.get("/",(req,res)=>{
    res.status(200).json({
        success: true,
        message: "Test checking"
    })
})