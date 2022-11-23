import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator"
import authServices from "../services/auth-services";
import User from "../modules/user";
import {ApiError} from "../config/error";

class AuthCtrl {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const errors:any = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Invalid Authentication." ,errors.array()))
            }

            const {account, password, name} = req.body
            const data = await authServices.register(account, password, name)
            if (!data) {
                return next(ApiError.BadRequest("User does not found."))
            }
            res.cookie(
                "refreshToken",
                data.refreshToken,
                {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(data)
        } catch (err: any) {
            next(err)
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const {account, password} = req.body
            const data = await authServices.login(account, password)
            if (!data) {
                return next(ApiError.BadRequest("User does not found."))
            }
            res.cookie(
                "refreshToken",
                data.refreshToken,
                {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})

            return res.json(data)
        } catch (err:any){
            next(err)
        }
    }
    async logout(req: Request, res: Response, next: NextFunction){
        try {
            const {refreshToken} = req.cookies
            const token = await authServices.logout(refreshToken)
            res.clearCookie("refreshToken")

            res.json(token)
        } catch (err: any) {
            next(err)
        }
    }
    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const {refreshToken} = req.cookies
            console.log("refreshToken - ", refreshToken)
            const data = await authServices.refresh(refreshToken)

            if (!data) {
                return next(ApiError.BadRequest("User does not found."))
            }
            res.cookie(
                "refreshToken",
                data.refreshToken,
                {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})

            return res.json(data)
        } catch (err: any) {
            next(err)
        }
    }
    async getUsers(req: Request, res: Response, next: NextFunction){
       try {
           const users = await User.find().select("-password")
           return res.json(users)
       } catch (err: any) {
           next(err)
       }

    }

}

export default new AuthCtrl()