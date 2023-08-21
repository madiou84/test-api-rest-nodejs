import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
};

export const validator =
    (schema: any) => (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, options);
        const valid = error == null;

        if (valid) {
            next();
        } else {
            const { name, details } = error;
            const errorsDetail = details
                .map((i: { message: any }) => i.message)
                .join(", ");
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: name,
                code: StatusCodes.BAD_REQUEST,
                message: errorsDetail,
                data: null as any,
            });
        }
    };
