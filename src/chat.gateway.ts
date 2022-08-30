import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit {

  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('ChatGateway');

  afterInit(server: any) {
	this.logger.log('Initialized!');
  }

  @SubscribeMessage('chatToServer')
  handleMessage(client: Socket, payload: { sender: string, room: string, message: string }) {
	this.server.to(payload.room).emit('chatToClient', payload);
  }

  @SubscribeMessage('joinRoom')
  handleRoomJoin(client: Socket, room: string ) {
		this.logger.log('client with id: '+ client.id + ', join ' + room)
		client.join(room);
		client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  handleRoomLeave(client: Socket, room: string ) {
    this.logger.log('client with id: '+ client.id + ', leave ' + room)
    client.leave(room);
    client.emit('leftRoom', room);
  }

  // create a new room
  @SubscribeMessage('createRoom')
  handleRoomCreate(client: Socket, room: string ) {
    this.logger.log('client with id: '+ client.id + ', create ' + room)
    client.join(room);
    client.emit('createdRoom', room);
  }

}
