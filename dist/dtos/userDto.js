"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserDto {
    constructor(model) {
        this.id = model.id;
        this.account = model.account;
        this.name = model.name;
    }
}
exports.default = UserDto;
