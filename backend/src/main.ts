import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  
  app.enableCors({origin: '*'});

  // app.use(
  //   session({ resave: false, saveUninitialized: false, secret: 'hey' }),
  // );
  // app.use(passport.initialize());
  // app.use(passport.session());

  await app.listen(8000);
}
bootstrap();
