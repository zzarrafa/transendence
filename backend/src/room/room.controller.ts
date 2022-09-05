import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/CreateRoom.dto';

@Controller('room')
export class RoomController {
    constructor(private roomService: RoomService) {}

    @Post('create')
    createRoom(@Body('room') room: CreateRoomDto, @Body('creatorId') creatorId: number) {
        return this.roomService.createRoom(room, creatorId);
    }

    @Get('/:userId')
    getRoomsForUser(@Param('userId') userId) {
        return this.roomService.getRoomsForUser(userId);
    }

    @Get('all')
    getAllRooms() {
        return this.roomService.getAllRooms();
    }

    // @Post('join')
    // joinRoom(@Body('roomId') roomId: any, @Body('userId') userId: any) {
    //     return this.roomService.joinRoom(roomId, userId);
    // }
}
