"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../config/error");
function default_1(err, req, res) {
    if (err instanceof error_1.ApiError) {
        return res.status(err.status).json({ message: err.message, errors: err.errors });
    }
    return res.status(500).json({ message: "Something went wrong." });
}
exports.default = default_1;
