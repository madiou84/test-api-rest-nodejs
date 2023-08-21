import Joi from "joi";

export const addCheckInValidation = Joi.object().keys({
    identifiantEmployee: Joi.number().required(),
    commantaire: Joi.string().optional(),
});

export const addCheckOutValidation = Joi.object().keys({
    identifiantEmployee: Joi.number().required(),
    commantaire: Joi.string().optional(),
});

export default {
    addCheckInValidation,
    addCheckOutValidation,
};
