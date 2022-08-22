import { ConfigService } from '@nestjs/config';
import { Profile, VerifyCallback } from 'passport-42';
declare const FtStrategy_base: new (...args: any[]) => any;
export declare class FtStrategy extends FtStrategy_base {
    constructor(config: ConfigService);
    validate(request: {
        session: {
            accessToken: string;
        };
    }, accessToken: string, refreshToken: string, profile: Profile, cb: VerifyCallback): Promise<any>;
}
export {};
