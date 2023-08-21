import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { employeeService } from "../services/employee.service";

export const getAllEmployeeHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const byDate: string = req.query?.byDate as any as string;
    try {
        const { code, error, message, data } =
            await employeeService.getAllEmployees({ byDate });
        return res.status(200).json({ code, error, message, data });
    } catch (error) {
        next({
            data: null as any,
            error: error.stack,
            message: error.message,
            code: StatusCodes.INTERNAL_SERVER_ERROR,
        });
    }
};

export const saveNewEmployeeHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, firstname, department } = req.body;
        const { code, error, message, data } =
            await employeeService.saveNewEmployee({
                name,
                firstname,
                department,
            });
        return res.status(200).json({ code, error, message, data });
    } catch (error) {
        next({
            data: null as any,
            error: error.stack,
            message: error.message,
            code: StatusCodes.INTERNAL_SERVER_ERROR,
        });
    }
};
