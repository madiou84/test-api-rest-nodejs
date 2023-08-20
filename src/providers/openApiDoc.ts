import swaggerJSDoc from "swagger-jsdoc";

const openApiDocument = {
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
    components: {
        schemas: {},
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
    tags: [
        {
            name: "Requests",
        },
        {
            name: "Missions",
        },
    ],
    paths: {
        // Requests
        "/requests": {
            // post: addRequest,
            // get: getRequests,
            // patch: updateRequest,
        },
        "/requests/badges": {
            // get: getRequestBadgeByStatus,
        },
        "/requests/{id}": {
            // patch: updateRequest,
            // get: getRequestById,
        },
    },
};

export default openApiDocument;

const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "LogRocket Express API with Swagger",
            version: "0.1.0",
            description:
                "This is a simple CRUD API application made with Express and documented with Swagger",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "LogRocket",
                url: "https://logrocket.com",
                email: "info@email.com",
            },
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    },
    apis: ["./routes/*.ts"],
};

export const specs = swaggerJSDoc(options);
