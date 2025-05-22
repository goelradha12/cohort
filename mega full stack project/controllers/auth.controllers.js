import { asyncHandler } from "../utils/async-handler.js";
import { User } from "../models/user.models.js";
import { apiError } from "../utils/api.error.js";
import { apiResponse } from "../utils/api.response.js";

export const registerUser = asyncHandler(async function (req, res) {
  // recieve name, email and password
    console.log(req.body);
  const {  username, email, pass } = req.body;

  try {
    // .. check if user exists, using username to make sure username is unique
    const user = User.findOne({ username });

    if (user) {
      // send error, user already exists
      res.status(401).json(new apiError(401, "Username already exists"));
    }

    const user2 = User.findOne({ email });
    if (user2) {
      res.status(401).json(new apiError(401, "Email already exists"));
    }

    // If not, add it to database unverified
    let encryptPass = await bcrypt.hash(pass, 10);
    const newUser = await User.create({
      username, 
      email,
      encryptPass,
    });
    console.log(newUser);

    if (!newUser) {
      res.status(400).json(new apiError(401, "Registration Failed"));
    }
  } catch (error) {
    return res.status(400).json(new apiError(401, error));
  }

  // validate using validators
});
