import jwt from "jsonwebtoken";


export const isLoggedIn = (req,res,next) => {
    // send next() only if valid access token

    const token = req.cookies.accessToken;
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json(
                    new apiError(401,"Invalid Token",err)
                );
            }
            req.user = decoded;
            next();
        });
    } else {
        return res.status(401).json(
            new apiError(401,"Invalid Data",err)
        );
    }
}