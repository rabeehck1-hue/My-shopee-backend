import { Router } from "express";
import mongoose from "mongoose";

const authMiddleware = (req,res,next) => {
    try{
        const authHeader = req.headers.authorization;

        if (!authHeader){
            return res.status(401).json({ error: "no token provided"})
        }

        const token = authHeader.split(" ")[1]

        const decoded = jwt.verify(token, "mysecretkey")

        req.user = decoded

        next()
    }catch(err){
        res.status(401).json({ error: "Invalid token"})
    }
}

export default Router