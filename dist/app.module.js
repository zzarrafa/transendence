"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const login_module_1 = require("./login/login.module");
const login_service_1 = require("./login/login.service");
const prisma_module_1 = require("./prisma/prisma.module");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("./User/user/user.service");
const user_module_1 = require("./User/user/user.module");
const two_fact_service_1 = require("./twofactorAuth/two-fact/two-fact.service");
const two_fact_module_1 = require("./twofactorAuth/two-fact/two-fact.module");
const request_module_1 = require("./Relationship/request/request.module");
const request_service_1 = require("./Relationship/request/request.service");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: '.env'
            }),
            user_module_1.UserModule,
            login_module_1.LoginModule,
            two_fact_module_1.TwoFactModule,
            axios_1.HttpModule,
            prisma_module_1.PrismaModule,
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            request_module_1.RequestModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [login_service_1.LoginService, jwt_1.JwtService, user_service_1.UserService, two_fact_service_1.TwoFactService, request_service_1.RequestService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map