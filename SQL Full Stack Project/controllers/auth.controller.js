import { PrismaClient } from "@prisma/client/extension"
import bcrypt from "bcryptjs"
import crypto from "crypto"

const prisma = new PrismaClient();


const registerUser = async (req,res)=>{
    // get data from .body
    const {name, email, password, phone} = req.body;

    // validate
    if(!email || !name || !password || !phone)
    {
        res.status(400).json({
            success: false,
            message: "All fields are required"
        })
    }

    // check if user already exists
    try {
        const existingUser = await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(existingUser)
        {
            res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        // if not, create a new unverified user
        // first hash password, then store
        const newPassword = await bcrypt.hash(password,10)
        const token = crypto.randomBytes(32).toString("hex");

        await prisma.user.create({
            data: {
                name,
                email,
                password: newPassword,
                verificationToken: token,
                phone,
            }
        })

        // send a mail to user with registerToken URL


        // create a new route with that url to verify

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Registration failed",
            error
        })
    }


}

export {registerUser}