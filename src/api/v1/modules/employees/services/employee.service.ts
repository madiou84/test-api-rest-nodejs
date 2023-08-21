import { Employee } from "api/v1/models/Employee";
import config from "config";
import client from "../../../../../providers/db";
import { formatDate, isValidDateFormat } from "../../../../../utils";
import {
    QueryParams,
    SaveNewEmployeeRequest,
    defaultValueQueryParams,
} from "./props";

const isDev = config.get("env") === "development";

export const employeeService = {
    async getAllEmployees(params: QueryParams = {}) {
        let { offset, limit, byDate } = params;
        if (!offset) {
            offset = defaultValueQueryParams.offset;
        }
        if (!limit || limit < 0) {
            limit = defaultValueQueryParams.limit;
        }

        const values: Array<string | number> = [offset, limit];
        let queryStr = /** sql*/ `SELECT * FROM employees`;

        if (byDate && isValidDateFormat(byDate)) {
            queryStr = /** sql*/ `${queryStr} WHERE TO_DATE(datecreated, 'YYYY-MM-DD') > '${byDate}' `;
        }

        queryStr = `${queryStr} OFFSET $1 LIMIT $2;`;
        try {
            const employees: Array<Employee> = await client.query(
                queryStr,
                values
            );

            return {
                code: 200,
                data: employees,
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
    async saveNewEmployee(data: SaveNewEmployeeRequest) {
        const { name, firstname, department } = data;

        const currentDate = formatDate(new Date());
        try {
            const res = await client.query(
                `
                    INSERT INTO employees (name, firstname, datecreated, department)
                    VALUES ($1, $2, $3, $4) RETURNING id, name, firstname, datecreated, department
                `,
                [name, firstname, currentDate, department]
            );

            const employees: Employee = res[0];

            return {
                code: 200,
                data: employees,
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
