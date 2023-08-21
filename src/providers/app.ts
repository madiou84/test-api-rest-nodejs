import cors from "cors";
import express from "express";
import routes from "./routes";

const app: express.Application = express();

app.use(express.json({ limit: "50mb" }));
app.use(
    express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 })
);
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));

// Mapping Routes
routes(app);

export default app;
