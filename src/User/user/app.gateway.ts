//handleconnection with socket.io

import { Logger } from '@nestjs/common';
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UserService } from './user.service';

@WebSocketGateway({ namespace: 'login' })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
	
	private logger: Logger = new Logger('login Gateway');
	constructor(private usersService: UserService) {}

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client: any) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
}