import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { CreateRoomDto } from './room/dto/CreateRoom.dto';
import { RoomService } from './room/room.service';
import { MessageService } from './message/message.service';

@WebSocketGateway({ namespace: "/chat", cors: true })
export class ChatGateway implements OnGatewayInit {
  constructor(private roomService: RoomService, private messageService: MessageService) {}
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
      rooms = rooms.filter((r) => !r.users.find((u) => u.id === this.currentUser.id) && !r.isPrivate && r.type !== "DM");
      this.server.to(client.id).emit('allRooms', rooms);
    }
    );
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connections = this.connections.filter((c) => c.id !== client.id);
  }

  async isMember(roomID: number, userId: number) {
    return this.roomService.getRoomById(roomID).then((room) => {
      return room.users.find((u) => u.id === userId);
    });
  }

  // createMessage
  @SubscribeMessage("createMessage")
  handleCreateMessage(client: Socket, payload: { content: string; room: number; user: number }) {
    // if user is member of 
    this.isMember(payload.room, payload.user).then((isMember) => {
      if(isMember) {
        this.messageService.createMessage(payload).then(() => {
          this.messageService.getMessagesForRoom(payload.room).then((messages) => {
            let userId:number;
            for(let x of this.connections)
            {
                userId = JSON.parse(x.handshake.query.user as string).id;
                this.isMember(payload.room, userId).then((isMember) => {
                if(isMember) {
                  this.server.to(x.id).emit('messages', {messages: messages, room: payload.room});
                }
              });
            }
        });
        });
      }
    })
  }
  
  @SubscribeMessage("joinRoom")
  handleRoomJoin(client: Socket, roomId: number) {
    let userId: number;
    let members: any;
    let userRooms: any;
    let allRooms: any;
    this.roomService.joinRoom(roomId, this.currentUser.id).then(async () => {
      userRooms = await this.roomService.getRoomsForUser(this.currentUser.id);
      this.server.to(client.id).emit('rooms', userRooms);
      for(let x of this.connections)
      {
        userId = JSON.parse(x.handshake.query.user as string).id;
        members = await (await this.roomService.getMembers(roomId)).users;
        allRooms = await this.roomService.getAllRooms();
        allRooms = allRooms.filter((r) => !r.users.find((u) => u.id === userId) && !r.isPrivate && r.type !== "DM");
        this.server.to(x.id).emit('allRooms', allRooms);
        this.server.to(x.id).emit('members', {members: members, roomId: roomId});
        this.server.to(x.id).emit('joinedRoom', roomId);
      }
    });
  }

  // a update !! 
  @SubscribeMessage("leaveRoom")
  handleRoomLeave(client: Socket, roomId: number) {
    this.roomService.leaveRoom(roomId, this.currentUser.id).then(() => {
      this.roomService.getRoomsForUser(this.currentUser.id).then((rooms) => {
        this.server.to(client.id).emit('rooms', rooms);
      });
      this.roomService.getAllRooms().then((rooms) => {
        rooms = rooms.filter((r) => !r.users.find((u) => u.id === this.currentUser.id) && !r.isPrivate && r.type !== "DM");
        this.server.to(client.id).emit('allRooms', rooms);
      }
      );
    });
  }

  @SubscribeMessage("createRoom")
  handleRoomCreate(client: Socket, payload: { room: CreateRoomDto; creatorId: number }) {
    let userId: number;
    let userRooms: any;
    let allRooms: any;
    
    this.roomService.createRoom(payload.room, payload.creatorId).then(async (room) => {

      for(let x of this.connections)
      {
        userId = JSON.parse(x.handshake.query.user as string).id;
        userRooms = await this.roomService.getRoomsForUser(userId);
        allRooms = await this.roomService.getAllRooms();
        allRooms = allRooms.filter((r) => !r.users.find((u) => u.id === userId) && !r.isPrivate && r.type !== "DM");
        this.server.to(x.id).emit('rooms', userRooms);
        this.server.to(x.id).emit('allRooms', allRooms);
        this.server.to(x.id).emit('createdRoom', room);
      }
  });
  }

  // ban user
  // @SubscribeMessage("banUser")
  // handleBanUser(client: Socket, payload: { userId: number; roomId: number }) {
  //   this.roomService.banUser(payload.roomId, payload.userId).then(() => {
  //     this.roomService.getMembers(payload.roomId).then((members) => {
  //       this.server.to(client.id).emit('members', {members: members.users, roomId: payload.roomId});
  //     });
  //   });
  // }

  // // mute user
  // @SubscribeMessage("muteUser")
  // handleMuteUser(client: Socket, payload: { userId: number; roomId: number }) {
  //   this.roomService.muteUser(payload.roomId, payload.userId).then(() => {
  //     this.roomService.getMembers(payload.roomId).then((members) => {
  //       this.server.to(client.id).emit('members', {members: members.users, roomId: payload.roomId});
  //     });
  //   });
  // }
  
}
