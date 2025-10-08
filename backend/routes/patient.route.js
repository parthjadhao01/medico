import express from "express";

const router = express.Router();

router.get("/me", (req,res)=>{
    res.send("hello")
})

export default router;

