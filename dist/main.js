"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const session = require("express-session");
const passport = require("passport");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    ;
    const configService = app.get(config_1.ConfigService);
    app.enableCors({
        origin: 'http://localhost:3000',
    });
    app.use(session({ resave: false, saveUninitialized: false, secret: 'hey' }));
    app.use(passport.initialize());
    app.use(passport.session());
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map