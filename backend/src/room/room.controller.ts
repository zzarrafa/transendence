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

    @Get('user/:userId')
    getRoomsForUser(@Param('userId') userId) {
        return this.roomService.getRoomsForUser(userId);
    }

    @Get('all')
    getAllRooms() {
        return this.roomService.getAllRooms();
    }

    @Get('/:roomId')
    getRoomById(@Param('roomId') roomId: number) {
        return this.roomService.getRoomById(roomId);
    }

    @Post('join')
    joinRoom(@Body('roomId') roomId: number, @Body('userId') userId: number) {
        return this.roomService.joinRoom(roomId, userId);
    }
    
    @Post('leave')
    leaveRoom(@Body('roomId') roomId: number, @Body('userId') userId: number) {
        return this.roomService.leaveRoom(roomId, userId);
    }

    @Delete('/delete')
    deleteAllRooms() {
        return this.roomService.deleteAllRooms();
    }
    // @Post('join')
    // joinRoom(@Body('roomId') roomId: any, @Body('userId') userId: any) {
    //     return this.roomService.joinRoom(roomId, userId);
    // }
}
