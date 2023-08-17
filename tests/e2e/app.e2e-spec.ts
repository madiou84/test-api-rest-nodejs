import chai from "chai";
import chaiHttp from "chai-http";
import { Pool } from "pg";
import { createServer } from "../../src/server";

chai.use(chaiHttp);
chai.config.truncateThreshold = 0;

const { expect } = chai;

describe("server", () => {
    let pool: Pool;
    let server: any;
    let app: any;

    beforeEach(async () => {
        pool = new Pool({
            host: "localhost",
            user: "root",
            password: "root",
        });
        const client = await pool.connect();

        await client.query(`DROP TABLE IF EXISTS checkpoints`);
        await client.query(`DROP TABLE IF EXISTS employees`);

        await client.query(`
          CREATE TABLE IF NOT EXISTS employees (
            id SERIAL PRIMARY KEY,
            name VARCHAR NOT NULL,
            firstName VARCHAR NOT NULL,
            dateCreated DATE NOT NULL,
            department VARCHAR
          )
        `);
        await client.query(`
          CREATE TABLE IF NOT EXISTS checkpoints (
            id SERIAL PRIMARY KEY,
            check_in DATE NOT NULL,
            check_out DATE NOT NULL,
            comment TEXT,
            employee_id INT,
            CONSTRAINT fk_employee_id
              FOREIGN KEY(employee_id)
              REFERENCES employees(id)
          )
        `);

        await client.query(`INSERT INTO employees (name, firstName, dateCreated, department) VALUES ('Madiou BAH', 'Madiou', CURRENT_TIMESTAMP, 'IT')`);
        await client.query(`INSERT INTO employees (name, firstName, dateCreated, department) VALUES ('John Doe', 'John', CURRENT_TIMESTAMP, 'Marketing')`);
        await client.query(`INSERT INTO employees (name, firstName, dateCreated, department) VALUES ('Clementina DuBuque', 'Clementina', CURRENT_TIMESTAMP, 'Communication')`);
        await client.query(`INSERT INTO employees (name, firstName, dateCreated, department) VALUES ('Hind Chihi', 'Hind', CURRENT_TIMESTAMP, 'DATA')`);
        await client.query(`INSERT INTO employees (name, firstName, dateCreated, department) VALUES ('Hend ABDESSADOK', 'Hend', CURRENT_TIMESTAMP, 'IT')`);
        await client.query(`INSERT INTO employees (name, firstName, dateCreated, department) VALUES ('Dennis Schulist', 'Dennis', CURRENT_TIMESTAMP, 'IT')`);
        await client.query(`INSERT INTO employees (name, firstName, dateCreated, department) VALUES ('Kurtis Weissnat', 'Kurtis', CURRENT_TIMESTAMP, 'IT')`);

        await client.query(`INSERT INTO checkpoints (check_in, check_out, comment, employee_id) VALUES (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Absent entre midi et 2', 1)`);
        await client.query(`INSERT INTO checkpoints (check_in, check_out, comment, employee_id) VALUES (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Absent entre 15 et 16', 2)`);

        client.release();
        server = createServer(pool);
        app = server.app;
    });

    afterEach(async () => {
        await server.close();
        await pool.end();
    });

    it("should get all employees", async () => {
        const response = await chai.request(app).get("/employees");
        expect(response.status).to.equal(200);
        expect(response).to.be.json;
        expect(response.body).to.be.instanceOf(Object);
        expect(response.body.data).to.be.instanceOf(Object);
        const expected = [
            {
                id: 1,
                department: "IT",
                name: "Madiou BAH",
                firstName: "Madiou",
                dateCreated: new Date(),
            },
            {
                id: 2,
                department: "IT",
                name: "Madiou BAH",
                firstName: "Madiou",
                dateCreated: new Date(),
            },
        ];
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

    // it("should return a 404 for post 3", async () => {
    //     const response = await chai.request(app).get("/checkpoints/3/employees");
    //     expect(response.status).to.equal(404);
    // });
});
