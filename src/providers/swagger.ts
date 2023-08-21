import { getAllEmployees } from "api/v1/modules/employees/docs/getEmployees.openapi";
import { acceptEmployeeRequest as SaveNewEmployee } from "api/v1/modules/employees/docs/saveNewEmployee.openapi";

export const swagger = {
    openapi: "3.0.3",
    info: {
        version: "1.0.0",
        title: "MINI Project NodeJS Rest API",
        description: "MINI Project NodeJS Rest API",
        termsOfService: "",
        contact: {
            name: "Madiou BAH",
            email: "mmadioubah@gmail.com",
        },
        license: {
            name: "Apache 2.0",
            url: "https://www.apache.org/licenses/LICENSE-2.0.html",
        },
    },
    servers: [
        {
            url: "/api/v1",
            description: "Local server",
        },
    ],
    tags: [
        {
            name: "Employee",
        },
        {
            name: "ChechPoint",
        },
    ],
    paths: {
        "/api/v1/employees": {
            get: getAllEmployees,
            post: SaveNewEmployee,
        },
    },
};
