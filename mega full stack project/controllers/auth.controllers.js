import {asyncHandler} from "../utils/async-handler"
import { User } from "../models/user.models";
import { apiError } from "../utils/api.error";

export const registerUser = asyncHandler(async function(req,res){
    // recieve name, email and password
    const {username, email, pass} = req.body;

    // .. check if user exists
    const user = User.findOne({ email });

    if(user)
    {
        
    }
    // If not, add it to database unverified
    

    // validate using validators
})