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
const express_validator_1 = require("express-validator");
const auth_services_1 = __importDefault(require("../services/auth-services"));
const user_1 = __importDefault(require("../modules/user"));
const error_1 = require("../config/error");
class AuthCtrl {
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return next(error_1.ApiError.BadRequest("Invalid Authentication.", errors.array()));
                }
                const { account, password, name } = req.body;
                const data = yield auth_services_1.default.register(account, password, name);
                if (!data) {
                    return next(error_1.ApiError.BadRequest("User does not found."));
                }
                res.cookie("refreshToken", data.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
                return res.json(data);
            }
            catch (err) {
                next(err);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { account, password } = req.body;
                const data = yield auth_services_1.default.login(account, password);
                if (!data) {
                    return next(error_1.ApiError.BadRequest("User does not found."));
                }
                res.cookie("refreshToken", data.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
                return res.json(data);
            }
            catch (err) {
                next(err);
            }
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.cookies;
                const token = yield auth_services_1.default.logout(refreshToken);
                res.clearCookie("refreshToken");
                res.json(token);
            }
            catch (err) {
                next(err);
            }
        });
    }
    refresh(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.cookies;
                console.log("refreshToken - ", refreshToken);
                const data = yield auth_services_1.default.refresh(refreshToken);
                if (!data) {
                    return next(error_1.ApiError.BadRequest("User does not found."));
                }
                res.cookie("refreshToken", data.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
                return res.json(data);
            }
            catch (err) {
                next(err);
            }
        });
    }
    getUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_1.default.find().select("-password");
                return res.json(users);
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = new AuthCtrl();
