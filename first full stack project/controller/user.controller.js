import User from "../model/User.model.js"
import crypto from "crypto"
import nodemailer from "nodemailer"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const registerUser = async (req,res) => {
    // get data
    const { name, email, password } = req.body;

    // validate
    if (!name || !email || !password) {
        return res.status(400).json({
        message: "All fields are required",
        });
    }

    // check if user already exists
    try {
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({
                message: "User already Exists",
            })
        }

        // create a user in database
        const user = await User.create({
            name,
            email,
            password,
        });
        console.log(user);

        if(!user) {
            return res.status(400).json({
                message: "User not registered",
            })
        }


        // create a verification token
        const token = crypto.randomBytes(32).toString("hex");
        user.verificationToken = token;

        // save token in databse
        await user.save(); // save the changes
        
        
        // send token as email to user
        var transport = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            secure: false,
            auth: {
                user: process.env.MAILTRAP_USERNAME,
                pass: process.env.MAILTRAP_PASSWORD
            }
        });
        

        await transport.sendMail({
            from: '<maddison53@ethereal.email>', // sender address
            to: user.email, // list of receivers
            subject: "Verify your email", // Subject line
            html: `<p>Please click on below link to verify your email:</p>
            <a href="${process.env.BASE_URL}/api/v1/users/verify/${token}">Click here</a>
            `, // html body
          });


        // send success status to user
        res.status(201).json({
            message: "User registered successfully",
            user,
            success: true,
          });

        
    } catch (error) {
        res.status(400).json({
            message: "User not Registered",
            error,
            success: false,
        });
    }

    // console.log(req.body);
    // res.send("registered")
}

const verifyUser = async (req,res)=>{
    // get token from user
    const {token} = req.params;
    // validate

    if(!token)
    {
        return res.status(400).json({
            message: "Invalid Token"
        })
    }
    // check if such token exists in database

   const user = await User.findOne({verificationToken: token});

    // if user exists, set isVerified to true
    if(!user)
    {
        return res.status(400).json({
            message: "Invalid Token"
        })
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    // remove that verification token
    
    // save the user
    await user.save();

    return res.status(201).json({
        message: "User Verified",
        user
    })
    // send response as done
}

const loginUser = async (req,res)=>{
    // recieve email
    const {email,password} = req.body;

    // check if email is present
    if(!email || !password) {
        return res.status(400).json({
            message: "All fields are required",
        })
    }

    try {
        const user = await User.findOne({email});  // User: mongoose model
        if(!user) {
            return res.status(400).json({
                message: "Email does not exists",
            })
        }

        // if yes, convert password to hash and compare
        const passwordVerify = bcrypt.compare(password,user.password);

        // if same, give status response 201 else 400
        if(!passwordVerify) {
            res.status(400).json({
                message: "Wrong email or password",
            })
        }

        if(!(user.isVerified))
        {
            res.status(400).json({
                message: "Verify your Email first",
            })
        }
        let token = jwt.sign({id:user._id},process.env.JWT_KEY,{expiresIn: '24h'});

        const cookieOptions =  {
            httpOnly: true,
            secure: true,
            maxAge: 26*60*60*1000,
        }
        res.cookie("test",token,cookieOptions)    
        
        res.status(201).json({
            success: true,
            message: "Login Successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role
            }
        })

    } catch(error) {
            return res.status(400).json({
                message: "Failed to connect with db",
                error,
            })
        
    }

}

const logoutUser = async(req,res) =>{
    try {
        res.cookie("test","",{
            expires: new Date(0),
        })
        res.status(200).json({
            success: true,
            message: "Logged Out Successfully"
        })
    } catch (error) {
        res.status(401).json({
            message: "Could not logOut",
            status: false,
        })
    }
}

const userProfile = async (req,res) =>{
    try {
        const user = await User.findOne({_id:req.user.id}).select('-password -createdAt')
        // console.log(user);

        if(!user)
        {
            res.status(400).json({
                success: false,
                message: "No user found",
            })
        }
        res.status(200).json({
            message: "Profile Shared Successfullly",
            user,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Could not open Profile"
        })
    }
}

const forgotPassword = async(req,res) =>{
    try {
        // if you are on forgot password page, share your email
        const {email} = req.body;
    
        if(!email) {
            res.status(400).json({
                success: false,
                message: "Email is required",
            })
        }
        // send response if user does not exists
        const user = await User.findOne({email});
    
        // if user doesn't exists,
        if(!user)
        {
            res.status(400).json({
                success: false,
                message: "Email doesn't exists"
            })
        }
    
        // set a resetPasswordToken and it's expiry
        let token = crypto.randomBytes(32).toString("hex");
        
        user.passwordResetToken = token;
        // console.log(user);
        let newDate = new Date().getTime() + 10*60*1000;
        user.passwordResetExpires = new Date(newDate); // 10 minutes in milliseconds
        // save the user
        await user.save();
    
        // send a mail
        var transport = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            secure: false,
            auth: {
                user: process.env.MAILTRAP_USERNAME,
                pass: process.env.MAILTRAP_PASSWORD
            }
        });
        

        await transport.sendMail({
            from: '<maddison53@ethereal.email>', // sender address
            to: user.email, // list of receivers
            subject: "Password Reset", // Subject line
            html: `<p>Please click on below link to reset Your Password:</p>
            <a href="${process.env.BASE_URL}/api/v1/users/resetPassword/${user.passwordResetToken}">Click here</a>
            `, // html body
          });

          res.status(200).json({
            success: true,
            message: "Mail sent successfully"
          })

        // now go to reset_Password.
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Failed Forgot password",
        })
    }
    
}

const resetPassword = async(req,res) =>{
    const {token} = req.params;
    const {password} = req.body;

    if(!token)
    {
        res.status(401).json({
            success: false,
            message: "Invalid Token"
        })
    }

    try {

        console.log("yes here",token,password)
        const user = await User.findOne({
            passwordResetToken:token,
            passwordResetExpires: {$gt: Date.now()}
        })
        if(!user)
        {
            res.status(500).json({
                success: false,
                message: "Invalid token"
            })
        }
        user.password = await bcrypt.hash(password,10);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        console.log(user);

        res.status(200).json({
            success: true,
            message: "Password updated"
        })

    } catch (error) {
        
        res.status(401).json({
            success: false,
            message: "Reset Password Failed",
        })
    }
}
// logoutUser, forgotPassword
export {registerUser,verifyUser,loginUser,logoutUser,forgotPassword,resetPassword,userProfile}