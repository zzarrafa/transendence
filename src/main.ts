import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { SocketIOAdapter } from './socket-io-adapter';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  
  const configService = app.get(ConfigService);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  app.enableCors({
    origin: 'http://localhost:3000',
  });
  app.useWebSocketAdapter(new SocketIOAdapter(app, configService));
  app.use(
    session({ resave: false, saveUninitialized: false, secret: 'hey' }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(3000);
}
bootstrap();
