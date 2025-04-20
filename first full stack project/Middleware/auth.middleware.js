
import jwt from "jsonwebtoken"

export const isLoggedIn = async(req,res,next) => {
    try {
        let token = req.cookies.test || "";
        
        if(!token)
            {
            res.status(401).json({
                message: "You are not logged in",
                success: false,
            })
        }
        
        const decoded = jwt.verify(token,process.env.JWT_KEY);
        
        // console.log(req.cookies);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(500).json({
            message: "Unable to connect",
            error,
        })
    }
}