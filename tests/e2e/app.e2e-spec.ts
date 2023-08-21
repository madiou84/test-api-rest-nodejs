import chai from "chai";
import chaiHttp from "chai-http";
import config from "config";
import { Pool } from "pg";
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
            check_out VARCHAR NOT NULL,
            comment TEXT,
            employee_id INT,
            CONSTRAINT fk_employee_id
              FOREIGN KEY(employee_id)
              REFERENCES employees(id)
          )
        `);

        await client.query(/* sql */ `
            INSERT INTO employees (name, firstname, datecreated, department)
            VALUES ('Madiou BAH', 'Madiou', '01/01/2024', 'IT')
        `);
        await client.query(/* sql */ `
            INSERT INTO employees (name, firstname, datecreated, department)
            VALUES ('John Doe', 'John', '01/01/2024', 'Marketing')
        `);
        await client.query(/* sql */ `
            INSERT INTO employees (name, firstname, datecreated, department)
            VALUES ('Clementina DuBuque', 'Clementina', '01/01/2024', 'Communication')
        `);
        await client.query(/* sql */ `
            INSERT INTO checkpoints (check_in, check_out, comment, employee_id)
            VALUES ('01/01/2024', '01/01/2024', 'Absent entre midi et 2', 1)
        `);
        await client.query(/* sql */ `
            INSERT INTO checkpoints (check_in, check_out, comment, employee_id)
            VALUES ('01/01/2024', '01/01/2024', 'Absent entre 15 et 16', 2)
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
                datecreated: "01/01/2024",
            },
            {
                id: 2,
                department: "Marketing",
                name: "John Doe",
                firstname: "John",
                datecreated: "01/01/2024",
            },
            {
                id: 3,
                department: "Communication",
                name: "Clementina DuBuque",
                firstname: "Clementina",
                datecreated: "01/01/2024",
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
        // In the before we have 3 insert in database
        const expected = {
            ...data,
            id: 4,
            datecreated: new Date().toDateString(),
        };
        expect(response.body.data).to.deep.eq(expected);
    });

    // it("should get employees for post 2", async () => {
    //     const response = await chai.request(app).get("/checkpoints/2/employees");
    //     expect(response.status).to.equal(200);
    //     expect(response).to.be.json;
    //     expect(response.body).to.be.instanceOf(Object);
    //     expect(response.body.data).to.be.instanceOf(Object);
    //     const expected = [
    //         { id: 5, text: "comment 2.1" },
    //         { id: 6, text: "comment 2.2" },
    //     ];
    //     expect(response.body.data).to.deep.eq(expected);
    // });

    it("should return a 404 for unkown url", async () => {
        const response = await chai.request(app).get("/api/v1/not_found");
        expect(response.status).to.equal(404);
    });
});
