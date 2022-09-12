import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { UserService } from './user.service';
export declare class UserGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private jwt;
    private config;
    private usersService;
    private logger;
    private connectedUsers;
    constructor(jwt: JwtService, config: ConfigService, usersService: UserService);
    io: Namespace;
    afterInit(): void;
    handleConnection(client: any): Promise<void>;
    handleDisconnect(client: any): Promise<void>;
}
