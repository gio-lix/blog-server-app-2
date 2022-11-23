"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user-controller"));
const express_validator_1 = require("express-validator");
const auth_middleware_1 = __importDefault(require("../middleware/auth-middleware"));
const router = express_1.default.Router();
router.post("/register", (0, express_validator_1.body)("account").isEmail(), (0, express_validator_1.body)("password").isLength({ min: 3, max: 32 }), user_controller_1.default.registration);
router.post("/login", user_controller_1.default.login);
router.post("/logout", user_controller_1.default.logout);
router.get("/refresh", user_controller_1.default.refresh);
router.get("/users", auth_middleware_1.default, user_controller_1.default.allUsers);
exports.default = router;
