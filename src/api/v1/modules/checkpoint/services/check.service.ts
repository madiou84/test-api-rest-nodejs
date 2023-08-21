import config from "config";
import { differenceInMinutes } from "date-fns";
import client from "../../../../../providers/db";
import { formatDate } from "../../../../../utils";
import { SaveNewCheckInRequest, SaveNewCheckOutRequest } from "./props";

const isDev = config.get("env") === "development";

export const checkService = {
    async saveNewCheckIn(check: SaveNewCheckInRequest) {
        // Dans la journee d'aujourdhui on a un new check
        try {
            const currentDate = formatDate(new Date());
            const res = await client.query(
                /** sql */ `
                SELECT * from checkpoints
                WHERE TO_DATE(check_in, 'YYYY-MM-DD') = '${currentDate}'
                    AND employee_id=$1
            `,
                [check.identifiantEmployee]
            );

            if (res?.length > 0) {
                return {
                    code: 400,
                    data: null as any,
                    error: null as any,
                    message: "Check-in has been marked for today",
                };
            }

            const newCheck = await client.query(
                /** sql */ `
                    INSERT INTO checkpoints (check_in, check_out, comment, employee_id)
                    VALUES (CURRENT_TIMESTAMP, '', $1, $2)
                    RETURNING check_in, check_out, comment, employee_id
                `,
                [check.commantaire, check.identifiantEmployee]
            );

            return {
                code: 200,
                data: newCheck[0],
                error: null as any,
                message: "Success",
            };
        } catch (error) {
            return {
                error: isDev ? error : null,
                code: 500,
                data: null,
                message: "Error",
            };
        }
    },
    async saveNewCheckOut(check: SaveNewCheckOutRequest) {
        // Dans la journee d'aujourdhui on a un new check
        try {
            const currentDate = formatDate(new Date());
            let res = await client.query(
                /** sql */ `
                SELECT * from checkpoints
                WHERE TO_DATE(check_in, 'YYYY-MM-DD') = '${currentDate}'
                    AND employee_id = $1
            `,
                [check.identifiantEmployee]
            );

            if (res.length < 1) {
                return {
                    code: 400,
                    data: null as any,
                    error: null as any,
                    message: "Check in must be completed before...",
                };
            }

            if (res.length > 1) {
                return {
                    code: 400,
                    data: null as any,
                    error: null as any,
                    message: "Check-out has been marked for today",
                };
            }

            const newCheck = await client.query(
                /** sql */ `
                    UPDATE checkpoints
                    SET check_out = CURRENT_TIMESTAMP, comment = $1
                    WHERE TO_DATE(check_in, 'YYYY-MM-DD') = '${currentDate}'
                        AND employee_id = $2
                    RETURNING check_in, check_out, comment, employee_id;
                `,
                [check.commantaire, check.identifiantEmployee]
            );

            res = await client.query(
                /** sql */ `
                SELECT * from checkpoints
                WHERE TO_DATE(check_in, 'YYYY-MM-DD') = '${currentDate}'
                    AND employee_id = $1
            `,
                [check.identifiantEmployee]
            );

            console.log(new Date(res[0].check_in), new Date(res[0].check_out));

            const diffInMinites = differenceInMinutes(
                new Date(res[0].check_out),
                new Date(res[0].check_in),
            );
            const data = {
                ...newCheck[0],
                diffInMinites,
            };

            return {
                data,
                code: 200,
                error: null as any,
                message: "Success",
            };
        } catch (error) {
            return {
                error: isDev ? error : null,
                code: 500,
                data: null,
                message: "Error",
            };
        }
    },
};
