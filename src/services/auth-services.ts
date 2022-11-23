import User from "../modules/user"
import tokenServices from "./token-services";
import bcrypt from "bcrypt"
import {ApiError} from "../config/error";
import jwt from "jsonwebtoken";
import Token from "../modules/token";
import {IUser} from "../config/interface";


class AuthServices {
    async register(account: string, password: string, name: string) {
        const findUser = await User.findOne({account})
        if (findUser) {
            // return
            throw ApiError.BadRequest(`This account -${account}- does not exist.`)
        }

        const hashPassword = await bcrypt.hash(password, 12)
        const newUser = new User({
            account, name,
            password: hashPassword
        })

        const token = tokenServices.generateTokens({...newUser._doc, password: ""})
        await tokenServices.saveToken(newUser._id, token.refreshToken)
        await newUser.save()
        return {...token, user: {...newUser._doc, password: ""}}
    }

    async login(account: string, password: string) {
        const user = await User.findOne({account})
        if (!user) {
            // return
            throw ApiError.BadRequest("This account does not exits")
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw ApiError.BadRequest("Password is incorrect.")
        }

        const token = tokenServices.generateTokens({...user._doc, password: ""})
        await tokenServices.saveToken(user._id, token.refreshToken)

        await User.findOneAndUpdate(
            {_id: user._id},
            {refreshToken: token.refreshToken})
        return {
            msg: 'Login Success!',
            ...token,
            user: {...user._doc, password: ''}
        }
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }

        const decoded = jwt.verify(refreshToken, `${process.env.JWT_REFRESH_SECRET}`)
        const token = await Token.findOne({decoded})

        if (!decoded || !token) {
            throw ApiError.UnauthorizedError()
        }

        const findUser = await User.findById(token.user).select("-password")


        const newToken = tokenServices.generateTokens({...findUser})
        await tokenServices.saveToken(findUser?._id, newToken.refreshToken)


        return {...newToken, user: findUser}
    }

    async logout(refreshToken: string) {
        const token = await tokenServices.removeToken(refreshToken)
        return token
    }
}

export default new AuthServices()