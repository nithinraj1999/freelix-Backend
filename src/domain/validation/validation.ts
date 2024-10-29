import Joi from 'joi';

export const signupSchema = Joi.object({
    email: Joi.string().email().lowercase().pattern(/^\S.*\S$/).required(),
    password: Joi.string().min(4).pattern(/^\S.*\S$/).required(),
    name: Joi.string().pattern(/^\S.*\S$/).min(1).required(),   
    phone:Joi.string().length(10).pattern(/^[0-9]+$/).required()
});

export const jobCreationSchema = Joi.object({
    title: Joi.string().pattern(/^\S.*\S$/).required(),
    paymentType: Joi.string().valid('fixed', 'hourly').required(),
    experience: Joi.string().pattern(/^\S.*\S$/).required(),
    description: Joi.string().pattern(/^\S.*\S$/).required(),
    userID: Joi.string().pattern(/^[a-fA-F0-9]{24}$/).required(),
    skills: Joi.string().pattern(/^\S.*\S$/).required().min(1).required(),
    file:Joi.string().optional(),
    fixedPrice: Joi.number().positive().optional(), 
    hourlyPrice: Joi.object({
        from: Joi.number().positive().required(),
        to: Joi.number().positive().greater(Joi.ref('from')).required(),
    }).optional(),
}).xor('fixedPrice', 'hourlyPrice');

export const loginSchema = Joi.object({
    email: Joi.string().email().lowercase().pattern(/^\S.*\S$/).required(),
    password: Joi.string().min(4).pattern(/^\S.*\S$/).required(),
})

