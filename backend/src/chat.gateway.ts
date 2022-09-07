import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { CreateRoomDto } from './room/dto/CreateRoom.dto';
import { RoomService } from './room/room.service';

@WebSocketGateway({ namespace: "/chat", cors: true })
export class ChatGateway implements OnGatewayInit {
  constructor(private roomService: RoomService) {}
  // connected users
  connections : Socket[] = [];
  // current user
  currentUser: any; // IUser

  @WebSocketServer() server: Server;

  private logger: Logger = new Logger("ChatGateway");

  afterInit(server: any) {
    this.logger.log("Initialized!");
  }
  // TODO: current user id then set socket.data.user = user
  // (take it from socket.handshake.query.token)

  handleConnection(client: Socket) {
    this.currentUser = JSON.parse(client.handshake.query.user as string);
    this.logger.log(`Client connected: ${client.id}`);
    this.connections.push(client);
    this.roomService.getRoomsForUser(this.currentUser.id).then((rooms) => {
      this.server.to(client.id).emit('rooms', rooms);
    });
    this.roomService.getAllRooms().then((rooms) => {
      this.server.to(client.id).emit('allRooms', rooms);
    }
    );
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connections = this.connections.filter((c) => c.id !== client.id);
  }

  @SubscribeMessage("chatToServer")
  handleMessage(
    client: Socket,
    payload: { sender: string; room: string; content: string, time: Date }
  ) {
    this.server.to(payload.room).emit("chatToClient", payload);
  }

  @SubscribeMessage("joinRoom")
  handleRoomJoin(client: Socket, room: string) {
    this.logger.log("client with id: " + client.id + ", join " + room);
    client.join(room);
    client.emit("joinedRoom", room);
  }

  @SubscribeMessage("leaveRoom")
  handleRoomLeave(client: Socket, room: string) {
    this.logger.log("client with id: " + client.id + ", leave " + room);
    client.leave(room);
    client.emit("leftRoom", room);
  }

  // create a new room
  @SubscribeMessage("createRoom")
  handleRoomCreate(client: Socket, payload: { room: CreateRoomDto; creatorId: number }) {
    let userId: number;
    
    this.roomService.createRoom(payload.room, payload.creatorId).then((room) => {
      this.logger.log("client with id: " + client.id + ", create " + room.name);
      for(let x of this.connections)
      {
        userId = JSON.parse(x.handshake.query.user as string).id;
        if(room.users.find((u) => u.id === userId)) {
          this.roomService.getRoomsForUser(userId).then((rooms) => {
            this.server.to(x.id).emit('rooms', rooms);
          });
        }
        this.roomService.getAllRooms().then((rooms) => {
          this.server.to(x.id).emit('allRooms', rooms);
        });
      }
      this.server.to(client.id).emit('createdRoom', room);
      client.join(room.name);
  });
  }
}
