import { INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
export declare class SocketIOAdapter extends IoAdapter {
    private app;
    private configService;
    private readonly logger;
    constructor(app: INestApplicationContext, configService: ConfigService);
    createIOServer(port: number, options?: ServerOptions): any;
}
