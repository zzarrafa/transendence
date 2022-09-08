"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const user_service_1 = require("./user.service");
const jwt_guard_1 = require("../../login/guards/jwt.guard");
const fs_1 = require("fs");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async getAllUsers(req) {
        return this.userService.getAllUsers();
    }
    async getProfile(request) {
        const user = this.userService.getUserById(request.user.id);
        const data = {
            "name": (await user).displayName,
            "wins": await this.userService.getWins(request.user.id),
            "loses": await this.userService.getLoses(request.user.id),
        };
        return data;
    }
    async getProfileById(request, id) {
        const user = this.userService.getUserById(id);
        const data = {
            "name": (await user).displayName,
            "wins": await this.userService.getWins(id),
            "loses": await this.userService.getLoses(id),
        };
        return data;
    }
    async updateProfilePic(request, imageName, picture) {
        fs_1.default.writeFileSync(process.cwd() + "/public/" + imageName, picture.buffer);
        return this.userService.updaatepicture(request.user.id, imageName);
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Get)('users'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Get)('profilee'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Get)('/profilee/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getProfileById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Post)('profilee/picture/:imageName'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('picture')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('imageName')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfilePic", null);
UserController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map