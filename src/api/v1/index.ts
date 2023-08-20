import { Router } from "express";
import ctl from "./modules/employees/handlers";

const router: Router = Router();

router.get("/employees", ctl.getAllEmployeeHandler);

export default router;
