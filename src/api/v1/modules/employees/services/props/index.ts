export const defaultValueQueryParams = {
    offset: 0,
    limit: 10,
};

export type QueryParams = { offset?: number; limit?: number; byDate?: string };

export class SaveNewEmployeeRequest {
    constructor(
        public name: string,
        public firstname: string,
        public department: string
    ) {}
}
