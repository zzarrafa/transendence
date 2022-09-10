import { Controller, UseGuards ,Req , Param, ParseIntPipe, Get, Post} from '@nestjs/common';
import {RequestService} from './request.service';
import { JwtGuard } from 'src/login/guards/jwt.guard';


@Controller('request')
@UseGuards(JwtGuard)
export class RequestController {
    constructor(private requestService: RequestService) {}

    @Post('add/:id')
    async addFriend(@Req() request, @Param('id', ParseIntPipe) id: number) {
        return this.requestService.addFriend(request.user, id);
    }
    // delete friend
    @Post('remove/:id')
    async removeFriend(@Req() request, @Param('id', ParseIntPipe) id: number) {
        return this.requestService.removeFriend(request.user, id);
    }
}
