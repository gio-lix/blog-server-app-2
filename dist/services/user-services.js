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
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_module_1 = __importDefault(require("../modules/user-module"));
const token_services_1 = __importDefault(require("./token-services"));
const error_1 = __importDefault(require("../config/error"));
class UserServices {
    registration(account, password, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidate = yield user_module_1.default.findOne({ account });
            if (candidate) {
                throw error_1.default.BadRequest(`User this email address -${account}- already exist.`);
            }
            const hashPassword = yield bcrypt_1.default.hash(password, 3);
            const newUser = yield user_module_1.default.create({
                name, account, password: hashPassword
            });
            const token = token_services_1.default.generateToken(Object.assign({}, newUser));
            yield token_services_1.default.saveToken(newUser.id, token.refreshToken);
            // await newUser.save()
            console.log(newUser);
            return Object.assign(Object.assign({}, token), { newUser });
        });
    }
    login(account, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_module_1.default.findOne({ account });
            if (!user) {
                throw error_1.default.BadRequest(`This account does not exits.`);
            }
            const isPasswordEqual = yield bcrypt_1.default.compare(password, user.password);
            if (!isPasswordEqual) {
                throw error_1.default.BadRequest(`incorrect password.`);
            }
            const token = token_services_1.default.generateToken(Object.assign({}, user));
            yield token_services_1.default.saveToken(user.id, token.refreshToken);
            return Object.assign(Object.assign({}, token), { user });
        });
    }
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenData = yield token_services_1.default.removeToken(refreshToken);
            return tokenData;
        });
    }
    refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!refreshToken) {
                throw error_1.default.UnauthorizedError();
            }
            const userData = token_services_1.default.validRefreshToken(refreshToken);
            const tokenValid = yield token_services_1.default.findToken(refreshToken);
            if (!userData || !tokenValid) {
                throw error_1.default.UnauthorizedError();
            }
            const user = yield user_module_1.default.findById(userData.id);
            // const {} = user
            console.log("???????????????????user???????", user.password);
            const token = token_services_1.default.generateToken(Object.assign({}, user));
            yield token_services_1.default.saveToken(user._id, token.refreshToken);
            return Object.assign(Object.assign({}, token), { user });
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield user_module_1.default.find();
            return users;
        });
    }
}
exports.default = new UserServices();
