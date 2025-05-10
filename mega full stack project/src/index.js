import app from "../app.js"
import dotenv from "dotenv"
import connectDb from "../db/index.js"

dotenv.config({path:"./.env"})
app.use(express.json());
const PORT = process.env.PORT || 3000;

connectDb()
.then(
    app.listen(PORT,(req,res)=>{
        console.log("I am listening here: ",PORT);
    })
)