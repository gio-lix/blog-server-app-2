"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserDto {
    constructor(model) {
        this.account = model.account;
        this.type = model.type;
        this.role = model.role;
        this.name = model.name;
        this.avatar = model.avatar;
    }
}
exports.default = UserDto;
