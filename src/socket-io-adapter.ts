import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);
  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app);
  }
  createIOServer(port: number, options?: ServerOptions) {
    

    const cors = {
      origin: [
        `http://localhost:3000`,
      ],
    };

    this.logger.log('Configuring SocketIO server with custom CORS options', {
      cors,
    });
    const optionsWithCORS: ServerOptions = {
      ...options,
      cors,
    };
    return super.createIOServer(port, optionsWithCORS);
  }
}