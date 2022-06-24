import { IsEmail, IsNotEmpty, IsString } from 'class-validator';


export class LogDto {
    @IsString()
    @IsNotEmpty()
    displayName: string;

    @IsString()
    picture: string;

}