const Joi = require('joi');

module.exports = {
    addPostSchema:{
        body: Joi.object().required().keys({
            name: Joi.string().required().messages({
                'string.empty':'sorry name is required',
            }),
            description: Joi.string().required().messages({
                'string.empty':'sorry description is required',
            }),
           
    })
        },
};