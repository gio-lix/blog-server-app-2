import {Request, Response} from "express";
import {ApiError} from "../config/error";

export default function (err: any,req: Request, res: Response) {
    if (err instanceof ApiError) {
        return res.status(err.status).json({message: err.message, errors: err.errors})
    }
    return res.status(500).json({message: "Something went wrong."})
}