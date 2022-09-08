import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(config: ConfigService, prisma: PrismaService);
    validate(payload: {
        sub: number;
        isSecondFactorAuthenticated: boolean;
    }): Promise<import(".prisma/client").User>;
}
export {};
