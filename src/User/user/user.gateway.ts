

import { Logger,} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';

import { Socket ,Namespace} from 'socket.io';
import {UserService} from './user.service';
import { UserStatus } from './user_status.enum';




@WebSocketGateway({ namespace: 'login/42' })
export class UserGateway implements OnGatewayInit,OnGatewayConnection, OnGatewayDisconnect{
	
	private logger: Logger = new Logger('login Gateway');
    private connectedUsers: { userId: number}[];
	constructor( private jwt: JwtService, private config: ConfigService, private usersService: UserService) { 
        this.connectedUsers = [];
    }
    // f front atb9ay tlopi 3la array connectedUsers bach tchofi chkon online wla ofline
    @WebSocketServer() io: Namespace;

    afterInit() {
        this.logger.log('Initialized hhhhh');
    }
async handleConnection(client:any) {
        const sockets= this.io.sockets;
        
        // console.log(client) // always to see where the cookies are
        const id = await this.jwt.verify(client.handshake.headers.cookie,
            { secret: this.config.get('JWT_SECRET') });
            
        client.data.status = "online";
        this.connectedUsers.push( {userId : id.sub} );
        this.io.emit('connectedUsers', this.connectedUsers);
        this.usersService.updateStatus(id.sub, UserStatus.ONLINE);
        this.logger.log(`Client connected: ${client.id}`);
       
    }
    async handleDisconnect(client: any) {
        const sockets = this.io.sockets;
        client.data.status = "ofline";

        const id = await this.jwt.verify(client.handshake.headers.cookie,
            { secret: this.config.get('JWT_SECRET') });

        this.connectedUsers.splice(this.connectedUsers.indexOf({ userId: id.sub }), 1);

        this.io.emit('connectedUsers', this.connectedUsers);
        this.usersService.updateStatus(id.sub, UserStatus.OFFLINE);
        this.logger.debug(`Disconnected socket id: ${client.id}`);
        
    }
}