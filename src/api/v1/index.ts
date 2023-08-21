import { Router } from "express";
import { validator } from "../../middlewares/validator";
import ctl from "./modules/employees/handlers";
import { addEmployeeValidation } from "./modules/employees/validators/addRequest.validator";

const router: Router = Router();

router.get("/employees", ctl.getAllEmployeeHandler);
router.post(
    "/employees",
    validator(addEmployeeValidation),
    ctl.saveNewEmployeeHandler
);

export default router;
