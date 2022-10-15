import { RequestService } from './request.service';
export declare class RequestController {
    private requestService;
    constructor(requestService: RequestService);
    addFriend(request: any, id: number): Promise<import(".prisma/client").User>;
    removeFriend(request: any, id: number): Promise<import(".prisma/client").User>;
}
