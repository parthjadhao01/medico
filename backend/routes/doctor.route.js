import express from "express";

const router = express.Router();

router.post("/me", (req,res)=>{
    res.send("hello")
})

export default router;

