import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';


export class CreateRoomDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    type: string;
    @IsBoolean()
    isPrivate: boolean;
    password: string;
}