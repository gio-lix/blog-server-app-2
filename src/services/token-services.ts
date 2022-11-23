import jwt from "jsonwebtoken"
import Token from "../modules/token"

class TokenServices {
    generateTokens (payload: any) {
        const accessToken = jwt.sign(
            payload,
            `${process.env.JWT_ACCESS_SECRET}`,
            {expiresIn: "30m"}
        )
        const refreshToken = jwt.sign(
            payload,
            `${process.env.JWT_REFRESH_SECRET}`,
            {expiresIn: "30m"}
        )
        return {refreshToken, accessToken}
    }

    async saveToken(userId: string, refreshToken: string){
        const tokenData = await Token.findOne({user: userId})
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            await tokenData.save()
            return tokenData
        }
        const token = new Token({
            user: userId, refreshToken
        })
        await token.save()
        return token
    }
    async removeToken(refreshToken: string) {
        const tokenDta = await Token.deleteOne({refreshToken})
        return tokenDta
    }

}

export default new TokenServices()