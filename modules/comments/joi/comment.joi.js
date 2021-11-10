const Joi = require('joi');

module.exports = {
    addCommentSchema:{
        body: Joi.object().required().keys({
            createdBy: Joi.string().required().messages({
                'string.empty':'sorry user id is required',
            }),
            product: Joi.string().required().messages({
                'string.empty':'sorry product id is required',
            }),
    })
}
};