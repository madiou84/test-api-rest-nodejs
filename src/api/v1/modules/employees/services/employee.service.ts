import client from "../../../../../providers/db";

export const employeeService = {
    async getAllEmployees() {
        try {
            const data = await client.query(
                /**sql*/ `SELECT * FROM employees ORDER BY id`
            );
            return { code: 200, error: null as any, message: "Success", data };
        } catch (error) {
            return { code: 500, error, message: "Failled", data: null };
        }
    },
};
