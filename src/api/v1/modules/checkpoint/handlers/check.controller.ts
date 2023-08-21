import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { checkService } from "../services/check.service";

export const saveNewCheckInHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { identifiantEmployee, commantaire } = req.body;
        const { code, error, message, data } =
            await checkService.saveNewCheckIn({
                identifiantEmployee,
                commantaire,
            });
        return res.status(code).json({ code, error, message, data });
    } catch (error) {
        next({
            data: null as any,
            error: error.stack,
            message: error.message,
            code: StatusCodes.INTERNAL_SERVER_ERROR,
        });
    }
};

export const saveNewCheckOutHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { identifiantEmployee, commantaire } = req.body;
        const { code, error, message, data } =
            await checkService.saveNewCheckOut({
                identifiantEmployee,
                commantaire,
            });
        return res.status(code).json({ code, error, message, data });
    } catch (error) {
        next({
            data: null as any,
            error: error.stack,
            message: error.message,
            code: StatusCodes.INTERNAL_SERVER_ERROR,
        });
    }
};
