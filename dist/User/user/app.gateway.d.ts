import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { UserService } from './user.service';
export declare class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private usersService;
    private logger;
    constructor(usersService: UserService);
}
