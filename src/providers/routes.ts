import config from "config";
import { Application, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import swaggerUI from "swagger-ui-express";
import Routes from "../api/v1";
import errorHandler, {
    ErrorSender,
    handleUnknownExceptions,
} from "../middlewares/errorHandler";
import logger from "../middlewares/logger";
import { swagger } from "./swagger";

const environment: string = config.get("env");

const routes = (app: Application) => {
    const baseUrl = "/api/v1";
    if (!baseUrl) {
        throw new ErrorSender({
            code: StatusCodes.BAD_GATEWAY,
            error: "ENVIRONMENT_NOT_DEFINED",
            message: "Undefined build environment.",
        });
    }

    // Base url handler
    app.get("/", (req: Request, res: Response) => {
        logger.info("Base url api called");
        return res.status(200).json({
            message: `MINI API running on ${environment} environment...`,
        });
    });

    // API docs hanlder
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swagger));

    // URLs of application
    app.use(baseUrl, Routes);

    // // Error handler
    app.use(errorHandler);
    app.use(handleUnknownExceptions);
};

export default routes;
