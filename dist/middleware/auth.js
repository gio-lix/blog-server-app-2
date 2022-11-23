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
const user_1 = __importDefault(require("../modules/user"));
const error_1 = require("../config/error");
function default_1(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const accessToken = req.headers.authorization;
            console.log("accessToken - ", accessToken);
            if (!accessToken) {
                throw error_1.ApiError.BadRequest("This account does not exits");
            }
            const token = accessToken.split(" ")[1];
            const decoded = jsonwebtoken_1.default.verify(token, `${process.env.JWT_ACCESS_SECRET}`);
            if (!decoded) {
                throw error_1.ApiError.BadRequest("Invalid Authorization");
            }
            const user = yield user_1.default.findOne({ _id: decoded._id });
            if (!user) {
                throw error_1.ApiError.BadRequest("Invalid Authorization");
            }
            req.user = user;
            next();
        }
        catch (err) {
            next(err);
        }
    });
}
exports.default = default_1;
