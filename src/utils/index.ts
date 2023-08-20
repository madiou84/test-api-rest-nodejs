export const getBaseUrl = (environment: string): string | null => {
    const urls: { [string: string]: string } = {
        test: "/api/v1/test",
        production: "/api/v1",
        development: "/api/v1",
        testing: "/api/v1/testing",
    };

    return urls[environment] || null;
};

export const toNumber = (str: string) => parseInt(str, 10);
