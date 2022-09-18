import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { CreateRoomDto } from './room/dto/CreateRoom.dto';
import { RoomService } from './room/room.service';
import { MessageService } from './message/message.service';
import { MembershipService } from './membership/membership.service';

@WebSocketGateway({ namespace: "/chat", cors: true })
export class ChatGateway implements OnGatewayInit {
  constructor(private roomService: RoomService, private messageService: MessageService, private membershipService: MembershipService) {}
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
    this.membershipService.getRoomsForUser(this.currentUser.id).then((rooms) => {
      this.server.to(client.id).emit('rooms', rooms);
    });
    this.roomService.getAllRooms().then((rooms) => {
      // allRooms: not private, not DM, user not member
      rooms = rooms.filter((r) => {
        return !r.users.find((u) => u.userId === this.currentUser.id) && !r.isPrivate && r.type !== "DM"});
      console.log("allRooms", rooms);
      this.server.to(client.id).emit('allRooms', rooms);
    }
    );
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connections = this.connections.filter((c) => c.id !== client.id);
  }

  @SubscribeMessage("createMessage")
  async handleCreateMessage(client: Socket, payload: { content: string; room: number; user: number }) {
    const isMuted = await this.membershipService.isMuted(payload.room, payload.user);
      if(!isMuted) {
        this.messageService.createMessage(payload).then(() => {
          this.messageService.getMessagesForRoom(payload.room).then(async(messages) => {
            let userId:number;
            for(let x of this.connections)
            {
                userId = JSON.parse(x.handshake.query.user as string).id;
                const isMuted = await this.membershipService.isMuted(payload.room, userId);
                if(!isMuted) {
                  this.server.to(x.id).emit('messages', {messages: messages, room: payload.room});
                }
            }
         });
      });
    }
  }
  
  @SubscribeMessage("joinRoom")
  handleRoomJoin(client: Socket, roomId: number) {
    let userId: number;
    let members: any;
    let userRooms: any;
    let allRooms: any;

    // create Membership
    this.membershipService.createMembership(roomId, this.currentUser.id).then(async (membership) => {
      // get rooms for user
      userRooms = await this.membershipService.getRoomsForUser(this.currentUser.id);
      // emit rooms to user
      this.server.to(client.id).emit('rooms', userRooms);
      for(let x of this.connections)
      {
        userId = JSON.parse(x.handshake.query.user as string).id;
        members = await this.membershipService.getMembersForRoom(roomId);
        allRooms = await this.roomService.getAllRooms();
        allRooms = allRooms.filter((r) => !r.users.find((u) => u.userId === userId) && !r.isPrivate && r.type !== "DM");
        this.server.to(x.id).emit('allRooms', allRooms);
        this.server.to(x.id).emit('members', {members: members, roomId: roomId});
        this.server.to(x.id).emit('joinedRoom', roomId);
      }
    });
  }

  // a update !! 
  @SubscribeMessage("leaveRoom")
  handleRoomLeave(client: Socket, roomId: number) {
    let userRooms: any;
    let allRooms: any;

    this.membershipService.deleteMembership(roomId, this.currentUser.id).then(async () => {
      userRooms = await this.membershipService.getRoomsForUser(this.currentUser.id);
      this.server.to(client.id).emit('rooms', userRooms);
      allRooms = await this.roomService.getAllRooms();
      allRooms = allRooms.filter((r) => !r.users.find((u) => u.userId === this.currentUser.id) && !r.isPrivate && r.type !== "DM");
      this.server.to(client.id).emit('allRooms', allRooms);
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
        userRooms = await this.membershipService.getRoomsForUser(userId);
        allRooms = await this.roomService.getAllRooms();
        allRooms = allRooms.filter((r) => !r.users.find((u) => u.userId === userId) && !r.isPrivate && r.type !== "DM");
        this.server.to(x.id).emit('rooms', userRooms);
        this.server.to(x.id).emit('allRooms', allRooms);
        this.server.to(x.id).emit('createdRoom', room);
      }
  });
  }

  @SubscribeMessage("banUser")
  async handleBanUser(client: Socket, payload: { roomId: number; userId: number}) {
    let userId: number;
    let members: any;
    let userRooms: any;
    let allRooms: any;
    const role = await this.membershipService.getRole(payload.roomId, this.currentUser.id);
    const userRole = await this.membershipService.getRole(payload.roomId, payload.userId);
    if (role > userRole) {
      this.membershipService.banUser(payload.roomId, payload.userId).then(async () => {
        for(let x of this.connections)
        {
          userId = JSON.parse(x.handshake.query.user as string).id;
          userRooms = await this.membershipService.getRoomsForUser(userId);
          members = await this.membershipService.getMembersForRoom(payload.roomId);
          allRooms = await this.roomService.getAllRooms();
          allRooms = allRooms.filter((r) => !r.users.find((u) => u.userId === userId) && !r.isPrivate && r.type !== "DM");
          this.server.to(x.id).emit('rooms', userRooms);
          this.server.to(x.id).emit('allRooms', allRooms);
          this.server.to(x.id).emit('members', {members: members, roomId: payload.roomId});
        }
      });
    }
    else {
      this.server.to(client.id).emit('error', "You can't ban this user");
    }
  }

  //  mt9drch tsyft msg hta twalli unmute
  @SubscribeMessage("muteUser")
  async handleMuteUser(client: Socket, payload: { roomId: number; userId: number, duration: number}) {
    let userId: number;
    let members: any;
    const role = await this.membershipService.getRole(payload.roomId, this.currentUser.id);
    const userRole = await this.membershipService.getRole(payload.roomId, payload.userId);
    if (role > userRole) {
      this.membershipService.updateMuted(payload.roomId, payload.userId, true).then(async () => {

        for(let x of this.connections)
        {
          userId = JSON.parse(x.handshake.query.user as string).id;
          members = await this.membershipService.getMembersForRoom(payload.roomId);
          this.server.to(x.id).emit('members', {members: members, roomId: payload.roomId});
          setTimeout(() => {
            this.server.to(x.id).emit('unmuteUser', {roomId: payload.roomId, userId: payload.userId});
          }, payload.duration * 60 * 1000);
        }
      });
    }
    else
    {
      this.server.to(client.id).emit('error', "You don't have permission to mute this user");
    }
  }

  @SubscribeMessage("unmuteUser")
  async handleUnmuteUser(client: Socket, payload: { roomId: number; userId: number}) {
    let members: any;
    const role = await this.membershipService.getRole(payload.roomId, this.currentUser.id);
    const userRole = await this.membershipService.getRole(payload.roomId, payload.userId);
    if (role > userRole) {
      this.membershipService.updateMuted(payload.roomId, payload.userId, false).then(async () => {
        for(let x of this.connections)
        {
          members = await this.membershipService.getMembersForRoom(payload.roomId);
          this.server.to(x.id).emit('members', {members: members, roomId: payload.roomId});
        }
      });
    }
    else
    {
      this.server.to(client.id).emit('error', "You don't have permission to unmute this user");
    }
  }
}
