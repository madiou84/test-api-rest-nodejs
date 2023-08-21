import Joi from "joi";

export const addEmployeeValidation = Joi.object().keys({
    name: Joi.string().required(),
    firstname: Joi.string().required(),
    department: Joi.string().required(),
});

export default {
    addEmployeeValidation,
};
