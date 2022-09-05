import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
    @IsString()
    name: string;

    @IsString()
    @IsNotEmpty()
    username: string;
}