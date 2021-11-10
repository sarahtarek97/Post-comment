const Joi = require('joi');

module.exports = {
    signUpSchema:{
        body: Joi.object().required().keys({
            userName: Joi.string().required().messages({
                'string.empty':'sorry name is required',
            }),
            email: Joi.string().required().email().messages({
                'string.email':'sorry enter valid email',
                'string.empty':'sorry email is required',

            }),
            password: Joi.string().required().messages({
                'string.empty':'sorry password is required',
            }),
            role: Joi.string().optional(),
            age: Joi.string().required(),
    })
        },
    signInSchema:{
        body: Joi.object().required().keys({
            email: Joi.string().required().email().messages({
                'string.email':'sorry enter valid email',
                'string.empty':'sorry email is required',
            }),
            password: Joi.string().required().messages({
                'string.empty':'sorry password is required',
            })
    })
    },
};