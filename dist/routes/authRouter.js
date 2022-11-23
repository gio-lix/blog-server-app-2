"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authCtrl_1 = __importDefault(require("../controllers/authCtrl"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
const express_validator_1 = require("express-validator");
router.post("/register", (0, express_validator_1.body)("account").isEmail(), (0, express_validator_1.body)("password").isLength({ min: 3, max: 32 }), authCtrl_1.default.register);
router.post("/login", authCtrl_1.default.login);
router.post('/logout', auth_1.default, authCtrl_1.default.logout);
router.get("/users", auth_1.default, authCtrl_1.default.getUsers);
router.get("/refresh", authCtrl_1.default.refresh);
exports.default = router;
