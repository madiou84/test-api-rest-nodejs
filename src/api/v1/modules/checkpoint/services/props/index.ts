export class SaveNewCheckInRequest {
    constructor(
        public identifiantEmployee: string,
        public commantaire: string
    ) {}
}

export class SaveNewCheckOutRequest {
    constructor(
        public identifiantEmployee: string,
        public commantaire: string
    ) {}
}
