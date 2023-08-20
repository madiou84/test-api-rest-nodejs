import config from "config";
import logger from "../middlewares/logger";
import { Pool } from "pg";

const connectionString: string = config.get("db");

const pool = new Pool({ connectionString });

pool.on("connect", () => {
    logger.info(`Connect to Postgresql database via ${connectionString}`);
});

export const connect = () => pool.connect();

export const query = async (text: string, values?: any) => {
    const client = await connect();
    const { rows } = await client.query(text, values);

    client.release();

    return rows;
};

export default {
    query,
    pool,
    connect,
};
