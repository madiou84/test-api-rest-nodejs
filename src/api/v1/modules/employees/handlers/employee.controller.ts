import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { employeeService } from "../services/employee.service";

const getAllEmployeeHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { code, error, message, data } =
            await employeeService.getAllEmployees();
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

export default getAllEmployeeHandler;
