import { Router } from "express";
import jwt from "jsonwebtoken";

const adminMiddleware = (req, res, next) => {
    try{
        if (req.user.role !== "admin") {
            return res.status(403).json({error: "Acces denied"})
        }

        next()
    }catch(err){
        res.status(401).json({error: "invalid token"})
    }
}

export default Router