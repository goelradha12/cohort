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

    // console.log("here")
    const newUser = new User({
      username, 
      email,
      password,
    });
    const {hashedToken, tokenExpiry} = newUser.generateTemporaryToken();
    
    // send email for verification
    let verificationURL = process.env.BASE_URL + "/api/v1/users/verifyMail/" + hashedToken;
    let expiryDateFormatted = new Date(tokenExpiry);
    const mailGenContent = emailVerificationMailGenContent(newUser.username, verificationURL, expiryDateFormatted.toLocaleString())
    sendMail({
        email: newUser.email,
        subject: "Email Verification Link",
        mailGenContent
      })
      
      // add it to database unverified
  
      newUser.emailVerificationToken = hashedToken;
      newUser.emailVerificationExpiry =  tokenExpiry;
  
      // console.log("----",newUser,"----");
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
        // emailVerificationToken: newUser.emailVerificationToken
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

export const verifyMail = asyncHandler(async function(req,res){
  // get token from URL
  const {token} = req.params;

  try {
    // check if such token exists.
    const user = await User.findOne({
      emailVerificationToken: token
    })
  
    if(!user)
    {
      throw new apiError(401, "Invalid Token");
    }

    // check if it's recieved on time or not
    user.emailVerificationToken = undefined;
    if(Date.now()>user.emailVerificationExpiry)
    {
      throw new apiError(401, "Time Out to verify your token");
    }
    // make user verified and send positive response
    user.isEmailVerified = true;

    await user.save();
    res.status(200).json(
      new apiResponse(
        200,
        {username: user.username, isVerified: user.isEmailVerified},
        "User Verified")
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
            message: "Something went wrong while verifying the user",
        })
  }
});

export const loginUser = asyncHandler(async function(req,res) {
  // Goal: add a jwt token in cookies
  // recieve (email || username) && password from user
  const {email,username,password} = req.body;

  try {
    // check if exists in db
    let user = undefined;
    if(email)
    {
      user = await User.findOne({email})
    }
    else if (username)
    {
      user = await User.findOne({username})
    }

    if(!user)
    {
      throw new apiError(401,"Invalid Username Or Email")
    }

    // verify password
    const isPassCorrect = await user.isPasswordCorrect(password);
    // console.log(isPassCorrect);
    if(isPassCorrect) {
      // add access token in cookies
      const accessToken = user.generateAccessToken();
      const cookieOptions =  {
            httpOnly: true,
            secure: true,
            maxAge: 26*60*60*1000,
        }
      res.cookie("accessToken",accessToken,cookieOptions)
      // add refresh token in database
      user.refreshToken = user.generateRefreshToken();
      await user.save();
      res.status(200).json(
        new apiResponse(
          200,
          {username:user.username, email: user.email, refreshToken: user.refreshToken},
          "User logged in Successfully")
      )
    }
    else {
      throw new apiError(401,"Wrong password")
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

export const changeCurrPassword = asyncHandler(async function(req,res) {
  // goal: recieve username or email and update new pass from old
  // recieve username|email and old password, new password
  const {username, email, oldPassword, newPassword} = req.body;

  try {
    // if such username or email exists, 
    let user = undefined;
    if(email)
    {
      user = await User.findOne({email})
    }
    else if (username)
    {
      user = await User.findOne({username})
    }
    
    if(!user)
    {
      throw new apiError(401,"Invalid Username Or Email")
    }
      
    // verify oldPassword
    const isCorrect = await user.isPasswordCorrect(oldPassword);

    if(!isCorrect)
    {
      throw new apiError(401,"Wrong password")
    }
    // update new password in db and save
    user.password = newPassword;

    await user.save();
    res.status(200).json(
       new apiResponse(
          200,
          {username:user.username, email: user.email},
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

export const resendVerificationEmail = asyncHandler(async function(req,res) {
  // Goal: send a mail to user with refresh token if he/she is not verified
  // ask for email/username and password
  const {username, email, password} = req.body;

  try {
    // if such username or email exists, 
    let user = undefined;
    if(email)
    {
      user = await User.findOne({email})
    }
    else if (username)
    {
      user = await User.findOne({username})
    }
    
    if(!user)
    {
      throw new apiError(401,"Invalid Username Or Email")
    }
      
    // verify password
    const isCorrect = await user.isPasswordCorrect(password);
    console.log(isCorrect);
    if(!isCorrect)
    {
      throw new apiError(401,"Wrong password")
    }
    // if user is valid check if already verified
    if(user.isEmailVerified)
    {
      throw new apiError(401,"Email Already Verified")
    }

    // send verification mail to the user
    const {hashedToken, tokenExpiry} = user.generateTemporaryToken();
    
    // send email for verification
    let verificationURL = process.env.BASE_URL + "/api/v1/users/verifyMail/" + hashedToken;
    let expiryDateFormatted = new Date(tokenExpiry)
    const mailGenContent = emailVerificationMailGenContent(user.username, verificationURL, expiryDateFormatted.toLocaleString())
    sendMail({
      email: user.email,
      subject: "Email Verification Link",
      mailGenContent
    })
      
    // add token to database 
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry =  tokenExpiry;
    // save changes
    await user.save();

    // send positive response
    res.status(200).json( 
    new apiResponse(
    200,
    {
      Username: user.username,
      Email: user.email,
      isVerified: user.isEmailVerified,
      emailVerificationToken: user.emailVerificationToken
    },
    "Mail Sent Successfully"
  ))
  } catch(error) {
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