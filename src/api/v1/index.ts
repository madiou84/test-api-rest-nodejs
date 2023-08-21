import { Router } from "express";
import { validator } from "../../middlewares/validator";
import checkCtl from "./modules/checkpoint/handlers";
import empCtl from "./modules/employees/handlers";
import empValidation from "./modules/employees/validators/addEmployee.validator";
import checkValidation from "./modules/employees/validators/checkIn.validator";

const router: Router = Router();

// Employee
router.get("/employees", empCtl.getAllEmployeeHandler);
router.post(
    "/employees",
    validator(empValidation.addEmployeeValidation),
    empCtl.saveNewEmployeeHandler
);

// check pont
router.post(
    "/check-in",
    validator(checkValidation.addCheckInValidation),
    checkCtl.saveNewCheckInHandler
);
router.post(
    "/check-out",
    validator(checkValidation.addCheckOutValidation),
    checkCtl.saveNewCheckOutHandler
);

export default router;
