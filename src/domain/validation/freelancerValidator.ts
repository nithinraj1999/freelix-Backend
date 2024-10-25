
import Joi from 'joi';

export const editProfileSchema = Joi.object({
    userID: Joi.string().pattern(/^[a-fA-F0-9]{24}$/).required(), // userID is required
    name: Joi.string().pattern(/^[a-zA-Z\s]*$/).min(1).optional(),
    title: Joi.string().pattern(/^\S.*\S$/).optional(),
    description: Joi.string().pattern(/^\S.*\S$/).optional(),
    skills:Joi.string().pattern(/^\S.*\S$/).optional(),
    file: Joi.string().optional(), // Optional file
});

export const bidSumissionSchema = Joi.object({
    jobId: Joi.string().pattern(/^[a-fA-F0-9]{24}$/).required(), 
    freelancerId: Joi.string().pattern(/^[a-fA-F0-9]{24}$/).required(), // userID is required
    bidAmount:Joi.number().positive().required(),
    deliveryDays:Joi.number().positive().required(),
    proposal: Joi.string().pattern(/^\S.*\S$/).required(),
});