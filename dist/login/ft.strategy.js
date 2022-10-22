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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FtStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const passport_42_1 = require("passport-42");
const user_service_1 = require("../User/user/user.service");
const user_dto_1 = require("./dto/user.dto");
const login_service_1 = require("./login.service");
let FtStrategy = class FtStrategy extends (0, passport_1.PassportStrategy)(passport_42_1.Strategy) {
    constructor(config, userService, loginservice) {
        super({
            clientID: config.get('clientID'),
            clientSecret: config.get('clientSecret'),
            callbackURL: 'http://localhost:3000/42/return',
        });
        this.userService = userService;
        this.loginservice = loginservice;
    }
    async validate(access_token, refreshToken, profile, cb) {
        if (!profile)
            return null;
        let userFound;
        console.log('===', profile['emails'][0]['value']);
        if (userFound = await this.userService.GetUserByEmail(profile['emails'][0]['value'])) {
            console.log('==== imane 7eza9a');
            return cb(null, userFound);
        }
        const user = new user_dto_1.CreateUserDto;
        user.fullName = profile['displayName'];
        user.avatar = profile['photos'][0]['value'];
        user.email = profile['emails'][0]['value'];
        user.status = '';
        user.XpPoints = 0;
        user.wins = 0;
        user.loses = 0;
        user.draws = 0;
        user.twoFactorAuthenticationSecret = '';
        user.isTwoFactorAuthenticationEnabled = false;
        user.globaRank = 0;
        user.cover = '';
        user.displayName = '';
        return cb(null, await this.loginservice.createUser(user));
    }
};
FtStrategy = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [config_1.ConfigService, user_service_1.UserService, login_service_1.LoginService])
], FtStrategy);
exports.FtStrategy = FtStrategy;
//# sourceMappingURL=ft.strategy.js.map