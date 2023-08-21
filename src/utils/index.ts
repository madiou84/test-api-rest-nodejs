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

export const isValidDateFormat = (dateString: string) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString);
};

export const formatDate = (date: Date) => {
    const getMonth = date.getMonth() + 1;
    const options = [
        date.getFullYear(),
        getMonth.toString().padStart(2, "0"),
        date.getDate().toString().padStart(2, "0"),
    ];

    return options.join("-");
};
