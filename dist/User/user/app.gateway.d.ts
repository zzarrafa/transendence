import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UserService } from './user.service';
export declare class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private usersService;
    private logger;
    constructor(usersService: UserService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: any): void;
}
