export const getAllEmployees = {
    tags: ["Employee"],
    description: "Accept Employee Request",
    operationId: "getAllEmployees",
    requestBody: {
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        byDate: {
                            type: "string",
                            schema: {
                                type: "string",
                                example: "2023-10-08",
                            },
                            required: false,
                            description: "Filter by date",
                        },
                    },
                },
            },
        },
    },
    responses: {
        "200": {
            description: "The employee was successfully added",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            error: {
                                type: "string",
                                description: "Error",
                            },
                            code: {
                                type: "string",
                                description: "Code of response",
                            },
                            message: {
                                type: "string",
                                description: "Message of response",
                            },
                            data: {
                                type: "object",
                                description: "Data retrieved",
                            },
                        },
                    },
                },
            },
        },
        "400": {
            description: "Invalid parameters",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            error: {
                                type: "string",
                                description: "Error",
                            },
                            code: {
                                type: "string",
                                description: "Code of response",
                            },
                            message: {
                                type: "string",
                                description: "Message of response",
                            },
                            data: {
                                type: "object",
                                description: "Data retrieved",
                            },
                        },
                    },
                },
            },
        },
    },
};

export default {
    getAllEmployees,
};
