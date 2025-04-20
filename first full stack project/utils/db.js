import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()


// cluster: group of services
// working with drivers, Add IP address
const db = ()=>{

    mongoose.connect(process.env.db_url)
    .then(()=>{
    console.log("Connected")
})
.catch((err)=>{
    console.log(process.env.db_url);
    console.log("Error connecting to mongo")
})
}

export default db;