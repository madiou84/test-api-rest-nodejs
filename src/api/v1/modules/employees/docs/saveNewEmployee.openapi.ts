export const acceptEmployeeRequest = {
    tags: ["Employee"],
    description: "Accept Employee Request",
    operationId: "acceptEmployeeRequest",
    requestBody: {
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            schema: {
                                type: "string",
                                example: "John Doe",
                            },
                            required: true,
                            description: "Name of employee",
                        },
                        firstname: {
                            type: "string",
                            schema: {
                                type: "string",
                                example: "John",
                            },
                            required: true,
                            description: "Firstname of employee",
                        },
                        department: {
                            type: "string",
                            schema: {
                                type: "string",
                                example: "IT",
                            },
                            required: true,
                            description: "Department of employee",
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
    acceptEmployeeRequest,
};
