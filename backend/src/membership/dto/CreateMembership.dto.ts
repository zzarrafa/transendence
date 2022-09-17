import { IsNotEmpty, IsString } from 'class-validator';
export class CreateMembershipDto {
    @IsNotEmpty()
    roomId: number;
    @IsNotEmpty()
    userId: number;
    
}