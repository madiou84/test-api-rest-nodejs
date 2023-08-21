import "reflect-metadata";
import logger from "./middlewares/logger";
import dataSource from "./providers/db";
import server from "./providers/server";

dataSource.pool.connect().then(() => {
    server.start();
});

process.on("uncaughtException", async (error: any) => {
    logger.error(error);
    await server.close();
});

process.on("unhandledRejection", async (error: any) => {
    logger.error(error);
    await server.close();
});

process.on("SIGTERM", async () => {
    logger.info("Gracefully shutting down");
    await server.close();
    process.exit(0);
});
