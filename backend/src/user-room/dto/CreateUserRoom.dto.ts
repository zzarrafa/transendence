import { IsNotEmpty } from 'class-validator';

export class CreateUserRoomDto {
    @IsNotEmpty()
    userId: number;
    @IsNotEmpty()
    roomId: number;
}