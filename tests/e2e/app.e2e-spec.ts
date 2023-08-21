import chai from "chai";
import chaiHttp from "chai-http";
import config from "config";
import { Pool } from "pg";
import { formatDate } from "../../src/utils";
import createServer from "../../src/providers/server";

chai.use(chaiHttp);
chai.config.truncateThreshold = 0;

const { expect } = chai;

describe("server", () => {
    let pool: Pool;
    let app: any;
    let server: any;

    beforeEach(async () => {
        pool = new Pool({ connectionString: config.get("db") });
        const client = await pool.connect();

        await client.query(/* sql */ `DROP TABLE IF EXISTS checkpoints`);
        await client.query(/* sql */ `DROP TABLE IF EXISTS employees`);
        await client.query(/* sql */ `
          CREATE TABLE IF NOT EXISTS employees (
            id SERIAL PRIMARY KEY,
            name VARCHAR NOT NULL,
            firstname VARCHAR NOT NULL,
            datecreated VARCHAR NOT NULL,
            department VARCHAR
          )
        `);
        await client.query(/* sql */ `
          CREATE TABLE IF NOT EXISTS checkpoints (
            id SERIAL PRIMARY KEY,
            check_in VARCHAR NOT NULL,
            check_out VARCHAR,
            comment TEXT,
            employee_id INT,
            CONSTRAINT fk_employee_id
              FOREIGN KEY(employee_id)
              REFERENCES employees(id)
          )
        `);

        await client.query(/* sql */ `
            INSERT INTO employees (name, firstname, datecreated, department)
            VALUES ('Madiou BAH', 'Madiou', '2023-08-22', 'IT')
        `);
        await client.query(/* sql */ `
            INSERT INTO employees (name, firstname, datecreated, department)
            VALUES ('John Doe', 'John', '2023-07-22', 'Marketing')
        `);
        await client.query(/* sql */ `
            INSERT INTO employees (name, firstname, datecreated, department)
            VALUES ('Clementina DuBuque', 'Clementina', '2023-06-22', 'Communication')
        `);
        await client.query(/* sql */ `
            INSERT INTO checkpoints (check_in, check_out, comment, employee_id)
            VALUES ('2023-06-22', '2023-06-22', 'Absent entre midi et 2', 1)
        `);
        await client.query(/* sql */ `
            INSERT INTO checkpoints (check_in, check_out, comment, employee_id)
            VALUES ('2023-06-22', '2023-06-22', 'Absent entre 15 et 16', 2)
        `);

        client.release();
        server = createServer.start();
        app = server.app;
    });

    afterEach(async () => {
        await createServer.close();
        await pool.end();
    });

    it("should get an ok by contacting the base url", async () => {
        const response = await chai.request(app).get("/");
        expect(response.status).to.equal(200);
        expect(response).to.be.json;
        expect(response.body).to.be.instanceOf(Object);
        const expected = {
            message: `MINI API running on ${process.env.NODE_ENV} environment...`,
        };
        expect(response.body).to.deep.eq(expected);
    });

    it("should return a 404 for unkown url", async () => {
        const response = await chai.request(app).get("/api/v1/not_found");
        expect(response.status).to.equal(404);
    });

    it("should get all employees", async () => {
        const response = await chai.request(app).get("/api/v1/employees");
        expect(response.status).to.equal(200);
        expect(response).to.be.json;
        expect(response.body).to.be.instanceOf(Object);
        expect(response.body.data).to.be.instanceOf(Array);
        const expected = [
            {
                id: 1,
                department: "IT",
                name: "Madiou BAH",
                firstname: "Madiou",
                datecreated: "2023-08-22",
            },
            {
                id: 2,
                department: "Marketing",
                name: "John Doe",
                firstname: "John",
                datecreated: "2023-07-22",
            },
            {
                id: 3,
                department: "Communication",
                name: "Clementina DuBuque",
                firstname: "Clementina",
                datecreated: "2023-06-22",
            },
        ];
        expect(response.body.data).to.deep.eq(expected);
    });

    it("should get all employees by date filter", async () => {
        const response = await chai
            .request(app)
            .get("/api/v1/employees?byDate=2023-08-21");
        expect(response.status).to.equal(200);
        expect(response).to.be.json;
        expect(response.body).to.be.instanceOf(Object);
        expect(response.body.data).to.be.instanceOf(Array);
        const expected = [
            {
                id: 1,
                department: "IT",
                name: "Madiou BAH",
                firstname: "Madiou",
                datecreated: "2023-08-22",
            },
        ];
        expect(response.body.data).to.deep.eq(expected);
    });

    it("should post and save an employee", async () => {
        const data = {
            name: "Hind Chihi",
            firstname: "Hind",
            department: "Recrutement",
        };
        const response = await chai
            .request(app)
            .post("/api/v1/employees")
            .send(data);
        expect(response.status).to.equal(200);
        expect(response).to.be.json;
        expect(response.body).to.be.instanceOf(Object);
        expect(response.body.data).to.be.instanceOf(Object);
        // We have previously 3 insert 3 line in the function (before) hence the id 4
        const expected = {
            ...data,
            id: 4,
            datecreated: formatDate(new Date()),
        };
        expect(response.body.data).to.deep.eq(expected);
    });

    it("should post an employee and get bad error", async () => {
        const data = {
            name: "Hind Chihi",
            // firstname: "Hind",
            department: "Recrutement",
        };
        const response = await chai
            .request(app)
            .post("/api/v1/employees")
            .send(data);
        expect(response.status).to.equal(400);
        expect(response).to.be.json;
        expect(response.body).to.be.instanceOf(Object);
        expect(response.body.data).to.be.equal(null);
        const expected: any = {
            error: "ValidationError",
            code: 400,
            message: '"firstname" is required',
            data: null,
        };
        expect(response.body).to.deep.eq(expected);
    });

    it("should post a new check-in", async () => {
        const data = {
            identifiantEmployee: 1,
            commantaire: "Ebsent entre midi et 2",
        };

        let response = await chai
            .request(app)
            .post("/api/v1/check-in")
            .send(data);
        expect(response.status).to.equal(200);
        expect(response).to.be.json;
        expect(response.body).to.be.instanceOf(Object);
        expect(response.body.data).to.be.instanceOf(Object);
        expect(response.body.data.employee_id).to.be.equal(1);
        expect(response.body.data.comment).to.be.equal(
            "Ebsent entre midi et 2"
        );
        expect(response.body.data.check_out).to.be.equal("");

        response = await chai.request(app).post("/api/v1/check-in").send(data);
        expect(response.status).to.equal(400);
        expect(response).to.be.json;
        expect(response.body).to.be.instanceOf(Object);
        expect(response.body.data).to.be.equal(null);
        const expected: any = {
            code: 400,
            data: null,
            error: null,
            message: "Check-in has been marked for today",
        };
        expect(response.body).to.be.deep.eq(expected);
    });

    it("should get an error validation to check-in with bad data", async () => {
        const data = {
            // identifiantEmployee: 1,
            commantaire: "Recrutement",
        };

        let response = await chai
            .request(app)
            .post("/api/v1/check-in")
            .send(data);
        expect(response.status).to.equal(400);
        expect(response).to.be.json;
        expect(response.body).to.be.instanceOf(Object);
        expect(response.body.data).to.be.eq(null);
        expect(response.body.error).to.be.eq("ValidationError");
        expect(response.body.message).to.be.eq(
            '"identifiantEmployee" is required'
        );
        const expected: any = {
            code: 400,
            data: null,
            error: "ValidationError",
            message: '"identifiantEmployee" is required',
        };
        expect(response.body).to.be.deep.eq(expected);
    });

    it("should post a new check-out", async () => {
        const data = {
            identifiantEmployee: 1,
            commantaire: "Ebsent entre midi et 2",
        };

        await chai.request(app).post("/api/v1/check-in").send(data);

        let response = await chai
            .request(app)
            .post("/api/v1/check-out")
            .send(data);
        expect(response.status).to.equal(200);
        expect(response).to.be.json;
        expect(response.body).to.be.instanceOf(Object);
        expect(response.body.data).to.be.instanceOf(Object);
        expect(response.body.data.employee_id).to.be.equal(1);
        expect(response.body.data.comment).to.be.equal(
            "Ebsent entre midi et 2"
        );
    });

    it("should get an error validation to check-out with bad data", async () => {
        let data = {
            identifiantEmployee: 1,
            commantaire: "Ebsent entre midi et 2",
        };

        await chai.request(app).post("/api/v1/check-in").send(data);

        delete data.identifiantEmployee;
        let response = await chai
            .request(app)
            .post("/api/v1/check-out")
            .send(data);
        expect(response.status).to.equal(400);
        expect(response).to.be.json;
        expect(response.body).to.be.instanceOf(Object);
        expect(response.body.data).to.be.eq(null);
        const expected: any = {
            error: "ValidationError",
            code: 400,
            message: '"identifiantEmployee" is required',
            data: null,
        };
        expect(response.body).to.be.deep.equal(expected);
    });
});
