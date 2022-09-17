import { Controller, Post, Get, Param, Delete, Body } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { CreateMembershipDto } from './dto/createMembership.dto';

@Controller('membership')
export class MembershipController {
    constructor(private membershipService: MembershipService) {}
    
    @Post('create')
    async createMembership(@Body() membership: CreateMembershipDto) {
        return this.membershipService.createMembership(membership.roomId, membership.userId);
    }

    @Get('/get/:roomId/:userId')
    async getMembership(@Param('roomId') roomId: number, @Param('userId') userId: number) {
        return this.membershipService.getMembership(roomId, userId);
    }

    @Delete('/delete/:roomId/:userId')
    async deleteMembership(@Param('roomId') roomId: number, @Param('userId') userId: number) {
        return this.membershipService.deleteMembership(roomId, userId);
    }

    @Get('/rooms/:userId')
    async getRoomsForUser(@Param('userId') userId: number) {
        return this.membershipService.getRoomsForUser(userId);
    }

    @Get('/isMember/:roomId/:userId')
    async isMember(@Param('roomId') roomId: number, @Param('userId') userId: number) {
        return this.membershipService.isMember(roomId, userId);
    }

    @Get('/members/:roomId')
    async getMembers(@Param('roomId') roomId: number) {
        return this.membershipService.getMembersForRoom(roomId);
    }

    @Post('/ban')
    async banUser(@Body() roomId: number, @Body() userId: number) {
        return this.membershipService.banUser(roomId, userId);
    }

    @Post('/updateRole')
    async updateRole(@Body() roomId: number, @Body() userId: number, @Body() role: number) {
        return this.membershipService.updateRole(roomId, userId, role);
    }

    @Post('/updateMute')
    async updateMute(@Body() roomId: number, @Body() userId: number, @Body() isMuted: boolean) {
        return this.membershipService.updateMuted(roomId, userId, isMuted);
    }
}
