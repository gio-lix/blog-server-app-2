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
const user_1 = __importDefault(require("../modules/user"));
const token_services_1 = __importDefault(require("./token-services"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const error_1 = require("../config/error");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token_1 = __importDefault(require("../modules/token"));
class AuthServices {
    register(account, password, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const findUser = yield user_1.default.findOne({ account });
            if (findUser) {
                // return
                throw error_1.ApiError.BadRequest(`This account -${account}- does not exist.`);
            }
            const hashPassword = yield bcrypt_1.default.hash(password, 12);
            const newUser = new user_1.default({
                account, name,
                password: hashPassword
            });
            const token = token_services_1.default.generateTokens(Object.assign(Object.assign({}, newUser._doc), { password: "" }));
            yield token_services_1.default.saveToken(newUser._id, token.refreshToken);
            yield newUser.save();
            return Object.assign(Object.assign({}, token), { user: Object.assign(Object.assign({}, newUser._doc), { password: "" }) });
        });
    }
    login(account, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.default.findOne({ account });
            if (!user) {
                // return
                throw error_1.ApiError.BadRequest("This account does not exits");
            }
            const isMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!isMatch) {
                throw error_1.ApiError.BadRequest("Password is incorrect.");
            }
            const token = token_services_1.default.generateTokens(Object.assign(Object.assign({}, user._doc), { password: "" }));
            yield token_services_1.default.saveToken(user._id, token.refreshToken);
            yield user_1.default.findOneAndUpdate({ _id: user._id }, { refreshToken: token.refreshToken });
            return Object.assign(Object.assign({ msg: 'Login Success!' }, token), { user: Object.assign(Object.assign({}, user._doc), { password: '' }) });
        });
    }
    refresh(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!refreshToken) {
                throw error_1.ApiError.UnauthorizedError();
            }
            const decoded = jsonwebtoken_1.default.verify(refreshToken, `${process.env.JWT_REFRESH_SECRET}`);
            const token = yield token_1.default.findOne({ decoded });
            if (!decoded || !token) {
                throw error_1.ApiError.UnauthorizedError();
            }
            const findUser = yield user_1.default.findById(token.user).select("-password");
            const newToken = token_services_1.default.generateTokens(Object.assign({}, findUser));
            yield token_services_1.default.saveToken(findUser === null || findUser === void 0 ? void 0 : findUser._id, newToken.refreshToken);
            return Object.assign(Object.assign({}, newToken), { user: findUser });
        });
    }
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield token_services_1.default.removeToken(refreshToken);
            return token;
        });
    }
}
exports.default = new AuthServices();
