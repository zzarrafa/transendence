"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserGateway = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const user_service_1 = require("./user.service");
const user_status_enum_1 = require("./user_status.enum");
let UserGateway = class UserGateway {
    constructor(jwt, config, usersService) {
        this.jwt = jwt;
        this.config = config;
        this.usersService = usersService;
        this.logger = new common_1.Logger('login Gateway');
        this.connectedUsers = [];
    }
    afterInit() {
        this.logger.log('Initialized hhhhh');
    }
    async handleConnection(client) {
        const sockets = this.io.sockets;
        const id = await this.jwt.verify(client.handshake.headers.cookie, { secret: this.config.get('JWT_SECRET') });
        client.data.status = "online";
        this.connectedUsers.push({ userId: id.sub });
        this.io.emit('connectedUsers', this.connectedUsers);
        this.usersService.updateStatus(id.sub, user_status_enum_1.UserStatus.ONLINE);
        this.logger.log(`Client connected: ${client.id}`);
    }
    async handleDisconnect(client) {
        const sockets = this.io.sockets;
        client.data.status = "ofline";
        const id = await this.jwt.verify(client.handshake.headers.cookie, { secret: this.config.get('JWT_SECRET') });
        this.connectedUsers.splice(this.connectedUsers.indexOf({ userId: id.sub }), 1);
        this.io.emit('connectedUsers', this.connectedUsers);
        this.usersService.updateStatus(id.sub, user_status_enum_1.UserStatus.OFFLINE);
        this.logger.debug(`Disconnected socket id: ${client.id}`);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Namespace)
], UserGateway.prototype, "io", void 0);
UserGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: '/login' }),
    __metadata("design:paramtypes", [jwt_1.JwtService, config_1.ConfigService, user_service_1.UserService])
], UserGateway);
exports.UserGateway = UserGateway;
//# sourceMappingURL=user.gateway.js.map