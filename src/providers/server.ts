import config from "config";
import http from "http";
import logger from "../middlewares/logger";
import app from "./app";
import { Pool } from "pg";

const port = +config.get("app.port");
const server = http.createServer(app);

const onListening = (): void => {
    const addr = server.address();
    const addrIsStr = typeof addr === "string";
    const bind = addrIsStr ? `pipe ${addr}` : `port ${addr.port}`;
    logger.debug(`[Server] is running on ${bind}`);
    logger.info("Press CTRL-C to stop\n");
};
const onError = (error: NodeJS.ErrnoException): void => {
    if (error.syscall !== "listen") throw error;
    const bind = `Port ${port}`;
    switch (error.code) {
        case "EACCES":
            logger.error(`${bind} requires elevated privileges`);
            break;
        case "EADDRINUSE":
            logger.error(`${bind} is already in use`);
            break;
        default:
            throw error;
    }
};

const createServer = {
    start(portServer: number = port) {
        server.listen(portServer);

        server.on("error", onError);
        server.on("listening", onListening);

        return {
            app,
        };
    },
    close() {
        return new Promise((resolve) => {
            server.close(() => {
                resolve(0);
                logger.info("[server] closed");
            });
        });
    },
};

export default createServer;
