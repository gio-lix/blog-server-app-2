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
const user_module_1 = __importDefault(require("../modules/user-module"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class MailServices {
    registration(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const credential = yield user_module_1.default.findOne({ email });
            if (!credential) {
                throw new Error(`User this email address -${email}- already exis`);
            }
            const hashPassword = yield bcrypt_1.default.hash(password, 3);
            const user = yield user_module_1.default.create({ email, password: hashPassword });
        });
    }
}
exports.default = new MailServices();
