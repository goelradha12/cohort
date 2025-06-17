import { asyncHandler } from "../utils/async-handler.js";
import { apiError } from "../utils/api.error.js";
import { apiResponse } from "../utils/api.response.js";
import { emailVerificationMailGenContent, forgotPasswordMailGenContent, sendMail } from "../utils/mail.js";
import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken, generateTemporaryTokens } from "../utils/generateTokens.js";

export const registerUser = asyncHandler(async function (req, res) {
    // recieve name, email and password
    // console.log(req.body);
    const { email, password } = req.body;

    try {
        // .. check if user exists, using username to make sure username is unique

        const user2 = await db.User.findUnique({
            where: {
                email
            }
        })
        if (user2) {
            throw new apiError(401, "Email already exists");
        }

        // console.log("here")
        const newUserData = {
            email: email.toLowerCase(),
            password: password,
            role: UserRole.USER
        };
        const { hashedToken, tokenExpiry } = generateTemporaryTokens();

        // send email for verification
        let verificationURL = process.env.BASE_URL + "/api/v1/auth/verifyMail/" + hashedToken;
        let expiryDateFormatted = new Date(tokenExpiry);
        const mailGenContent = emailVerificationMailGenContent(newUserData.username, verificationURL, expiryDateFormatted.toLocaleString())

        // add it to database unverified

        newUserData.emailVerificationToken = hashedToken;
        newUserData.emailVerificationExpiry = tokenExpiry;

        // console.log("----",newUser,"----");
        const newUser = await db.User.create({ data: newUserData })

        if (!newUser) {
            throw new apiError(401, "Could not create new User");
        }

        // sending mail only after new User is created in db
        sendMail({
            email: newUserData.email,
            subject: "Email Verification Link",
            mailGenContent
        })
        res.status(200).json(
            new apiResponse(
                200,
                {
                    Email: newUser.email,
                    Avatar: newUser.avatar,
                    isVerified: newUser.isEmailVerified,
                    role: newUser.role
                    // emailVerificationToken: newUser.emailVerificationToken
                },
                "User Registered Successfully"
            ))
    } catch (error) {
        console.log(error)
        if (error instanceof apiError) {
            return res.status(error.statusCode).json({
                statusCode: error.statusCode,
                message: error.message,
                success: false,
            })
        }

        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Something went wrong while registering the user",
        })
    }

});

export const verifyMail = asyncHandler(async function (req, res) {
    const { token } = req.params;

    try {
        // check if such token exists.
        const user = await db.User.findFirst({
            where: {
                emailVerificationToken: token
            }
        });

        if (!user) {
            throw new apiError(401, "Invalid Token");
        }

        // check if it's received on time or not
        if (Date.now() > user.emailVerificationExpiry) {
            throw new apiError(401, "Time Out to verify your token");
        }

        // make user verified and remove token
        const updatedUser = await db.User.update({
            where: { id: user.id },
            data: {
                isEmailVerified: true,
                emailVerificationToken: null,
                emailVerificationExpiry: null
            }
        });

        res.status(200).json(
            new apiResponse(
                200,
                { Email: updatedUser.email, isVerified: updatedUser.isEmailVerified },
                "User Verified")
        );

    } catch (error) {
        console.log(error);
        if (error instanceof apiError) {
            return res.status(error.statusCode).json({
                statusCode: error.statusCode,
                message: error.message,
                success: false,
            });
        }

        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Something went wrong while verifying the user",
        });
    }
});


export const loginUser = asyncHandler(async function (req, res) {
    // Goal: add two jwt tokens (access and refresh) in cookies
    // recieve (email || username) && password from user
    const { email, password } = req.body;

    try {
        // check if exists in db
        const user = await db.User.findUnique({ where: { email } })
        

        if (!user) {
            throw new apiError(401, "Invalid Username Or Email")
        }

        // verify password
        const isPassCorrect = await bcrypt.compare(password,user.password);
        
        // console.log(isPassCorrect);
        if (isPassCorrect) {

            // login only if verified
            const isUserVerified = user.isEmailVerified;
            if (!isUserVerified)
                throw new apiError(401, "Verify Email Before Login")

            // add access token in cookies
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
            const cookieOptions = {
                httpOnly: true,
                sameSite: "strict",
                secure: true,
                maxAge: 24 * 60 * 60 * 1000,
            }
            res.cookie("accessToken", accessToken, cookieOptions)
            res.cookie("refreshToken", refreshToken, cookieOptions)
            // add refresh token in database
            await db.User.update({
                where: {
                    id: user.id
                },
                data: {
                    refreshToken
                }
            })
            res.status(200).json(
                new apiResponse(
                    200,
                    { username: user.username, email: user.email, isVerified: user.isEmailVerified, role: user.role, refreshToken: refreshToken },
                    "User logged in Successfully")
            )
        }
        else {
            throw new apiError(401, "Wrong password")
        }

    }
    catch (error) {
        console.log(error)
        if (error instanceof apiError) {
            return res.status(error.statusCode).json({
                statusCode: error.statusCode,
                message: error.message,
                success: false,
            })
        }

        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Something went wrong while logging the User",
        })
    }
})

export const changeCurrPassword = asyncHandler(async function (req, res) {
    // goal: recieve username or email and update new pass from old
    // recieve username|email and old password, new password
    const { email, oldPassword, newPassword } = req.body;

    try {
        // check if such email exists, 
        const user = await db.User.findUnique({ where: {email} })
    
        if (!user) {
            throw new apiError(401, "Invalid Username Or Email")
        }

        // verify oldPassword
        const isCorrect = await bcrypt.compare(oldPassword,user.password)

        if (!isCorrect) {
            throw new apiError(401, "Wrong password")
        }
        // update new password in db and save
        await db.User.update({
            where: {
                id: user.id
            },
            data: {
                password: newPassword
            }
        })

        res.status(200).json(
            new apiResponse(
                200,
                { email: user.email, isVerified: user.isEmailVerified, role: user.role },
                "Password changed Successfully")
        )
    } catch (error) {
        console.log(error)
        if (error instanceof apiError) {
            return res.status(error.statusCode).json({
                statusCode: error.statusCode,
                message: error.message,
                success: false,
            })
        }

        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Something went wrong",
        })
    }
})

export const resendVerificationEmail = asyncHandler(async function (req, res) {
    // Goal: send a mail to user with refresh token if he/she is not verified
    // ask for email/username and password
    const { email, password } = req.body;

    try {
        // if such username or email exists, 
        
        const user = await db.User.findUnique({ where: { email } })
        

        if (!user) {
            throw new apiError(401, "Invalid Username Or Email")
        }

        // verify password
        const isCorrect = await bcrypt.compare(password, user.password);
        if (!isCorrect) {
            throw new apiError(401, "Wrong password")
        }
        // if user is valid check if already verified
        if (user.isEmailVerified) {
            throw new apiError(401, "Email Already Verified")
        }

        // send verification mail to the user
        const { hashedToken, tokenExpiry } = generateTemporaryTokens();

        // add token to database 
        // save changes
        await db.User.update({
            where: {
                id: user.id
            },
            data: {
                emailVerificationToken: hashedToken,
                emailVerificationExpiry: tokenExpiry
            }
        })
        
        // send email for verification
        let verificationURL = process.env.BASE_URL + "/api/v1/auth/verifyMail/" + hashedToken;
        let expiryDateFormatted = new Date(tokenExpiry)
        const mailGenContent = emailVerificationMailGenContent(user.username, verificationURL, expiryDateFormatted.toLocaleString())
        sendMail({
            email: user.email,
            subject: "Email Verification Link",
            mailGenContent
        })


        // send positive response
        res.status(200).json(
            new apiResponse(
                200,
                {
                    Email: user.email,
                    isVerified: user.isEmailVerified
                },
                "Mail Sent Successfully"
            ))
    } catch (error) {
        console.log(error)
        if (error instanceof apiError) {
            return res.status(error.statusCode).json({
                statusCode: error.statusCode,
                message: error.message,
                success: false,
            })
        }

        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Something went wrong",
        })
    }
})

export const forgotPasswordRequest = asyncHandler(async function (req, res) {
    // Goal: send a mail to user with forgotPass token as param accepting their mail
    const { email } = req.body;
    try {
        // if such username or email exists,
        const user = await db.User.findUnique({ where: { email } })
        
        if (!user) {
            throw new apiError(401, "Invalid Email")
        }

        // create a forgotPasswordToken
        const { hashedToken, tokenExpiry } = generateTemporaryTokens();
        // save it in db 
        const updatedUser = await db.User.update({
            where: {
                id: user.id
            },
            data: {
                forgotPasswordToken: hashedToken,
                forgotPasswordExpiry: tokenExpiry
            }
        })


        // send it to user in his/her mail
        const formattedDate = new Date(tokenExpiry);
        const resetPassLink = process.env.BASE_URL + "/api/v1/auth/resetPassword/" + hashedToken;
        const mailGenContent = forgotPasswordMailGenContent(user.username, resetPassLink, formattedDate.toLocaleString())
        sendMail({
            email: user.email,
            subject: "Reset Password Link",
            mailGenContent
        })


        // send success message
        return res.status(200).json(
            new apiResponse(
                200,
                { email: updatedUser.email, isVerified: updatedUser.isEmailVerified, role: updatedUser.role,name:updatedUser.username },
                "Mail sent to Reset Your Password")
        )
    } catch (error) {
        console.log(error)
        if (error instanceof apiError) {
            return res.status(error.statusCode).json({
                statusCode: error.statusCode,
                message: error.message,
                success: false,
            })
        }

        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Something went wrong",
        })
    }
})

export const resetPassword = asyncHandler(async function (req, res) {
    // Goal: update password with : token and : password
    const { token } = req.params;
    const { newPassword } = req.body;

    try {

        // get user with token
        const user = await db.User.findFirst({ where: {
            forgotPasswordToken: token
        }
        })
        if (!user) {
            throw new apiError(401, "Invalid Token")
        }

        // store expiry and remove from db
        const expiry = user.forgotPasswordExpiry;

        if (expiry < Date.now())
            throw new apiError(401, "Request TimeOut")

        await db.User.update({
            where: {
                id: user.id
            },
            data: {
                forgotPasswordToken: null,
                forgotPasswordExpiry: null,
                password: newPassword
            }
        })

        // send positive response
        res.status(200).json(
            new apiResponse(
                200,
                {
                    name: user.name,
                    role: user.role,
                    email: user.email
                },
                "Password Resetted Successfully"
            )
        )
    } catch (error) {
        console.log(error)
        if (error instanceof apiError) {
            return res.status(error.statusCode).json({
                statusCode: error.statusCode,
                message: error.message,
                success: false,
            })
        }

        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Something went wrong",
        })
    }

})

export const getUser = asyncHandler(async function (req, res) {
    // if user is logged in (access token is there), send user profile
    try {
        if (req.user) {

            const myUser = await db.User.findUnique({ where:{ id: req.user._id} })
            if (!myUser)
                throw new apiError(401, "No such User Exists")

            res.status(200).json(
                new apiResponse(200, {
                    name: myUser.name,
                    avatar: myUser.image,
                    email: myUser.email,
                    isEmailVerified: myUser.isEmailVerified,
                    role: myUser.role
                }, "User Profile Shared Successfully")
            )
        }
        else {
            throw new apiError(401, "Invalid User")
        }
    }
    catch (error) {
        console.log(error)
        if (error instanceof apiError) {
            return res.status(error.statusCode).json({
                statusCode: error.statusCode,
                message: error.message,
                success: false,
            })
        }

        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Something went wrong",
        })
    }
})

export const updateUserProfile = asyncHandler(async function (req, res) {
    // goal: user can edit {name, avatar} in its profile
    // Make sure user is logged in(has access token) before giving the access

    // get newName, newAvatar
    const { newName, newImage } = req.body;

    try {
        if (!(newName || req.file))
            throw new apiError(401, "No data recieved to update")

        if (req.user) {
            const myUser = await db.User.findUnique({ where:{id: req.user._id} });
            if (!myUser) throw new apiError(401, "No such User Exists");

            if (newName)
                await db.User.update({
                    where: {
                        id: myUser.id
                    },
                    data: {
                        name: newName
                    }
                });

            if (newImage)
                await db.User.update({
                    where: {
                        id: myUser.id
                    },
                    data: {
                        image: newImage
                    }
                });
            const updatedUser = await db.User.findUnique({ where:{id: myUser.id} })
            res.status(200).json(
                new apiResponse(
                    200,
                    {
                        name: updatedUser.name,
                        image: updatedUser.image,
                        email: updatedUser.email,
                        isEmailVerified: updatedUser.isEmailVerified,
                        role: updatedUser.role
                    },
                    "User updated Successfully",
                ),
            );
        } else {
            throw new apiError(401, "Invalid Token");
        }
    } catch (error) {
        console.log(error);
        if (error instanceof apiError) {
            return res.status(error.statusCode).json({
                statusCode: error.statusCode,
                message: error.message,
                success: false,
            });
        }

        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Something went wrong",
        });
    }
});


export const refreshAccessToken = asyncHandler(async function (req, res) {
    // goal: when user gets on this URL, give him new access token if valid
    const { refreshToken } = req.cookies;
    // console.log(refreshToken)
    try {
        let user;
        if (refreshToken) {
            // get userData, and check for user in db
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, userData) => {
                if (err) {
                    return res.status(401).json(
                        new apiError(401, "Invalid Token", err)
                    );
                }
                user = userData;
            });
            // console.log(user)
            const myUser = await db.User.findUnique({ where: {id: user._id} })
            if (!myUser)
                throw new apiError(401, "Invalid Token");
            const accessToken = generateAccessToken(myUser);
            const cookieOptions = {
                httpOnly: true,
                secure: true,
                maxAge: 24 * 60 * 60 * 1000,
            }
            res.cookie("accessToken", accessToken, cookieOptions)

            res.status(200).json(
                new apiResponse(
                    200,
                    "Access Token Refreshed Successfully")
            )
        } else {
            throw new apiError(401, "Login Required")
        }
    }
    catch (error) {
        console.log(error)
        if (error instanceof apiError) {
            return res.status(error.statusCode).json({
                statusCode: error.statusCode,
                message: error.message,
                success: false,
            })
        }

        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Something went wrong",
        })
    }
})


export const logOutUser = asyncHandler(async function (req, res) {
    // if user is logged in (check for refresh token), 
    // remove jwt tokens (refresh token) from db and cookies
    const { refreshToken } = req.cookies;
    // console.log(refreshToken)
    try {
        let user;
        if (refreshToken) {
            // get userData, and check for user in db
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, userData) => {
                if (err) {
                    return res.status(401).json(
                        new apiError(401, "Invalid Token", err)
                    );
                }
                user = userData;
            });
            // console.log(user)
            const myUser = await db.User.findUnique({ where:{ id: user._id} })
            if (!myUser)
                throw new apiError(401, "Invalid Token");

            // user exists, removing tokens
            res.clearCookie('refreshToken')
            res.clearCookie('accessToken')

            // removing refresh token from db
            await db.User.update({
                where: {
                    id: myUser.id
                },
                data: {
                    refreshToken: null
                }
            })
            return res.status(200).json(
                new apiResponse(200, "Logged Out Successfully")
            )
        }
        else {
            throw new apiError(401, "Already Logged Out")
        }
    } catch (error) {
        console.log(error)
        if (error instanceof apiError) {
            return res.status(error.statusCode).json({
                statusCode: error.statusCode,
                message: error.message,
                success: false,
            })
        }

        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Something went wrong",
        })
    }
})
    