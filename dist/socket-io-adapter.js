"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIOAdapter = void 0;
const common_1 = require("@nestjs/common");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
class SocketIOAdapter extends platform_socket_io_1.IoAdapter {
    constructor(app, configService) {
        super(app);
        this.app = app;
        this.configService = configService;
        this.logger = new common_1.Logger(SocketIOAdapter.name);
    }
    createIOServer(port, options) {
        const cors = {
            origin: [
                `http://localhost:3000`,
            ],
        };
        this.logger.log('Configuring SocketIO server with custom CORS options', {
            cors,
        });
        const optionsWithCORS = Object.assign(Object.assign({}, options), { cors });
        return super.createIOServer(port, optionsWithCORS);
    }
}
exports.SocketIOAdapter = SocketIOAdapter;
//# sourceMappingURL=socket-io-adapter.js.map