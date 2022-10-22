import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/User/user/user.service';
import { LoginService } from './login.service';
declare const FtStrategy_base: new (...args: any[]) => any;
export declare class FtStrategy extends FtStrategy_base {
    private userService;
    private loginservice;
    constructor(config: ConfigService, userService: UserService, loginservice: LoginService);
    validate(access_token: string, refreshToken: string, profile: any, cb: any): Promise<any>;
}
export {};
