import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/CreateRoom.dto';

@Controller('room')
export class RoomController {
    constructor(private roomService: RoomService) {}

    @Post('create')
    createRoom(@Body('room') room: CreateRoomDto, @Body('creatorId') creatorId: number) {
        return this.roomService.createRoom(room, creatorId);
    }

    @Get('all')
    getAllRooms() {
        return this.roomService.getAllRooms();
    }

    @Get('/:roomId')
    getRoomById(@Param('roomId') roomId: number) {
        return this.roomService.getRoomById(roomId);
    }
}
