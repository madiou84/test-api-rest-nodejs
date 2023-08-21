DROP TABLE IF EXISTS checkpoints;
DROP TABLE IF EXISTS employees;
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    firstName VARCHAR NOT NULL,
    dateCreated VARCHAR NOT NULL,
    department VARCHAR
);
CREATE TABLE IF NOT EXISTS checkpoints (
    id SERIAL PRIMARY KEY,
    check_in VARCHAR NOT NULL,
    check_out VARCHAR NOT NULL,
    comment TEXT,
    employee_id INT,
    CONSTRAINT fk_employee_id FOREIGN KEY(employee_id) REFERENCES employees(id)
);