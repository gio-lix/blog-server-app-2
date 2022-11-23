"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = __importDefault(require("../config/error"));
const token_services_1 = __importDefault(require("../services/token-services"));
function default_1(req, res, next) {
    try {
        const authToken = req.headers.authorization;
        if (!authToken) {
            return next(error_1.default.UnauthorizedError());
        }
        const accessToken = authToken.split(" ")[1];
        if (!accessToken) {
            return next(error_1.default.UnauthorizedError());
        }
        const userData = token_services_1.default.validAccessToken(accessToken);
        if (!userData) {
            return next(error_1.default.UnauthorizedError());
        }
        req.user = userData;
        next();
    }
    catch (err) {
        return next(error_1.default.UnauthorizedError());
    }
}
exports.default = default_1;
