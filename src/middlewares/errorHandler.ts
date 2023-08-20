import config from "config";
import { NextFunction, Request, Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import logger from "./logger";

export class ErrorSender extends Error {
    code: number;

    message: string;

    error: any;

    data: any;

    constructor({
        code,
        message,
        error,
    }: {
        code: number;
        message: string;
        error: string;
    }) {
        super();
        this.code = code;
        this.message = message;
        this.error = error;
        this.data = null;
    }
}

const handleKnownExceptions = (err: ErrorSender, res: Response) => {
    const { code, message, error, data } = err;
    logger.error(err);
    return res.status(code).json({ error, code, message, data });
};

export const handleUnknownExceptions = (
    err: ErrorSender,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        data: null as any,
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        error: config.get("env") === "development" ? err : null,
        message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    });
};

const errorHandler = (req: Request, res: Response, next: NextFunction) => {
    return res.status(StatusCodes.NOT_FOUND).json({
        data: null,
        code: StatusCodes.NOT_FOUND,
        error: getReasonPhrase(StatusCodes.NOT_FOUND),
        message: getReasonPhrase(StatusCodes.NOT_FOUND),
    });
};

export default errorHandler;
