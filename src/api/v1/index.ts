import { Router } from "express";
import ctl from "./modules/employees/handlers";

const router: Router = Router();

router.get("/employees", ctl.getAllEmployeeHandler);
router.post("/employees", ctl.saveNewEmployeeHandler);

export default router;
