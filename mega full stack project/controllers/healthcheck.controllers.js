import {apiResponse} from "../utils/api.response.js"

const healthCheck = (req,res) => {
    // res.send("Server running")
    // console.log("Reached")
    res.status(200).json(
        new apiResponse(200,{message: "Server Running"})
    )
}

export {healthCheck}