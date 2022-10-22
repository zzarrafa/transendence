"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ft_strategy_1 = require("./ft.strategy");
const login_controller_1 = require("./login.controller");
const login_service_1 = require("./login.service");
const jwt_1 = require("@nestjs/jwt");
const jwt_strategy_1 = require("./jwt/jwt.strategy");
const config_2 = require("@nestjs/config");
const prisma_module_1 = require("../prisma/prisma.module");
const axios_1 = require("@nestjs/axios");
const user_service_1 = require("../User/user/user.service");
const user_module_1 = require("../User/user/user.module");
let LoginModule = class LoginModule {
};
LoginModule = __decorate([
    (0, common_1.Module)({
        imports: [jwt_1.JwtModule.register({}),
            config_2.ConfigModule.forRoot({ isGlobal: true }),
            axios_1.HttpModule,
            prisma_module_1.PrismaModule,
            user_module_1.UserModule
        ],
        controllers: [login_controller_1.LoginController],
        providers: [config_1.ConfigService, ft_strategy_1.FtStrategy, login_service_1.LoginService, jwt_strategy_1.JwtStrategy, user_service_1.UserService],
    })
], LoginModule);
exports.LoginModule = LoginModule;
//# sourceMappingURL=login.module.js.map