import { asyncHandler } from "../utils/async-handler.js";
import { User } from "../models/user.models.js";
import { apiError } from "../utils/api.error.js";
import { apiResponse } from "../utils/api.response.js";
import { emailVerificationMailGenContent, sendMail } from "../utils/mail.js";

export const registerUser = asyncHandler(async function (req, res) {
  // recieve name, email and password
    // console.log(req.body);
  const {  username, email, password } = req.body;

  try {
    // .. check if user exists, using username to make sure username is unique
    const user = await User.findOne({ username });

    if (user) {
      // send error, user already exists
     throw new apiError(401,"Username already exists");
      // res.status(401).json({
      //   statusCode: "401",
      //   success: false,
      //   message: "Username already exists"
      // });
    }

    const user2 = await User.findOne({ email });
    if (user2) {
      throw new apiError(401,"Email already exists");
    }

    console.log("here")
    const newUser = new User({
      username, 
      email,
      password,
    });
    const {hashedToken, tokenExpiry} = newUser.generateTemporaryToken();
    
    // send email for verification
    let verificationURL = process.env.BASE_URL + "/api/v1/users/verifyMail/" + hashedToken;
    const mailGenContent = emailVerificationMailGenContent(newUser.username, verificationURL, newUser.emailVerificationExpiry)
    sendMail({
        email: newUser.email,
        subject: "Email Verification Link",
        mailGenContent
      })
      
      // add it to database unverified
  
      newUser.emailVerificationToken = hashedToken;
      newUser.emailVerificationExpiry =  tokenExpiry;
  
      console.log("----",newUser,"----");
      await newUser.save();
  
      if (!newUser) {
        throw new apiError(401,"Could not create new User");
      }
    res.status(200).json( 
      new apiResponse(
      200,
      {
        Username: newUser.username,
        Email: newUser.email,
        Avatar: newUser.avatar,
        isVerified: newUser.isEmailVerified,
        emailVerificationToken: newUser.emailVerificationToken
      },
      "User Registered Successfully"
    ))
  //   return res.status(200).json({
  //     User: {
  //       Username: newUser.username,
  //       Email: newUser.email,
  //       Avatar: newUser.avatar,
  //       isVerified: newUser.isEmailVerified,
  //       emailVerificationToken: newUser.emailVerificationToken
  //     },
  //     statusCode: "200",
  //     success: true,
  //     message: "Registration SUccessfull"
  // })

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
