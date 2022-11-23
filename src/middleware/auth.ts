import {NextFunction, Response} from "express";
import jwt from "jsonwebtoken";
import {IReqAuth, IUser} from "../config/interface";
import User from "../modules/user"
import {ApiError} from "../config/error";

export default async function (req: IReqAuth, res: Response, next: NextFunction) {
    try {
        const accessToken = req.headers.authorization
        console.log("accessToken - ", accessToken)
        if (!accessToken) {
            throw ApiError.BadRequest("This account does not exits")
        }

        const token = accessToken.split(" ")[1]


        const decoded = jwt.verify(token, `${process.env.JWT_ACCESS_SECRET}`)


        if (!decoded) {
            throw ApiError.BadRequest("Invalid Authorization")
        }
        const user = await User.findOne({_id: (decoded as IUser)._id})

        if (!user) {
            throw ApiError.BadRequest("Invalid Authorization")
        }

        req.user = user

        next()
    } catch (err) {
        next(err)
    }
}
