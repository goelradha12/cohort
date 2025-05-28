import { Router } from "express";


const router = Router();
router.route("/").get((req,res)=>{
    console.log("connected")
    return res.status(200).json({success: true})
})

export default router;