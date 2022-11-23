"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token_1 = __importDefault(require("../modules/token"));
class TokenServices {
    generateTokens(payload) {
        const accessToken = jsonwebtoken_1.default.sign(payload, `${process.env.JWT_ACCESS_SECRET}`, { expiresIn: "30m" });
        const refreshToken = jsonwebtoken_1.default.sign(payload, `${process.env.JWT_REFRESH_SECRET}`, { expiresIn: "30m" });
        return { refreshToken, accessToken };
    }
    saveToken(userId, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenData = yield token_1.default.findOne({ user: userId });
            if (tokenData) {
                tokenData.refreshToken = refreshToken;
                yield tokenData.save();
                return tokenData;
            }
            const token = new token_1.default({
                user: userId, refreshToken
            });
            yield token.save();
            return token;
        });
    }
    removeToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenDta = yield token_1.default.deleteOne({ refreshToken });
            return tokenDta;
        });
    }
}
exports.default = new TokenServices();
