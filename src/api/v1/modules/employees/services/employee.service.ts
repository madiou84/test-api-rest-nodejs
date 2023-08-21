import { Employee } from "api/v1/models/Employee";
import config from "config";
import client from "../../../../../providers/db";
import {
    QueryParams,
    SaveNewEmployeeRequest,
    defaultValueQueryParams,
} from "./props";

const isDev = config.get("env") === "development";

export const employeeService = {
    async getAllEmployees(params: QueryParams = defaultValueQueryParams) {
        const { offset, limit } = params;

        try {
            const employees: Array<Employee> = await client.query(
                /** sql*/ `SELECT * FROM employees ORDER BY id OFFSET $1 LIMIT $2;`,
                [offset, limit]
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

        const currentDate = new Date().toDateString();
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
