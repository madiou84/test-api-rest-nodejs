import config from "config";
import logger from "../middlewares/logger";
import { Pool } from "pg";

const connectionString: string = config.get("db");

const pool = new Pool({ connectionString });

pool.on("connect", () => {
    logger.info(`Connect to Postgresql database via ${connectionString}`);
});

pool.on("error", (err, client) => {
    logger.error("Unexpected error on idle client", err.stack);
    process.exit(-1);
});

export const query = async <T>(text: string, values?: T[]) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");
        const { rows } = await client.query({ text, values });
        await client.query("COMMIT");
        return rows;
    } catch (e) {
        await client.query("ROLLBACK");
        throw e;
    } finally {
        client.release();
    }
};

export default {
    query,
    pool,
};
