
import Joi from 'joi';



export const becomeFreelancerSchema = Joi.object({
    userID: Joi.string().pattern(/^[a-fA-F0-9]{24}$/).required(), // userID is required

    name: Joi.string().pattern(/^\S.*\S$/).required(),
    description:Joi.string().pattern(/^\S.*\S$/).required(),
    skills:Joi.string().pattern(/^\S.*\S$/).required(),
    languages:Joi.string().pattern(/^\S.*\S$/).required()
});


export const editProfileSchema = Joi.object({
    userID: Joi.string().pattern(/^[a-fA-F0-9]{24}$/).required(), // userID is required
    name: Joi.string().pattern(/^[a-zA-Z\s]*$/).min(1).optional(),
    title: Joi.string().pattern(/^\S.*\S$/).optional(),
    description: Joi.string().pattern(/^\S.*\S$/).optional(),
    skills: Joi.array().items(Joi.string().pattern(/^\S.*\S$/)).optional(),
    file: Joi.string().optional(), // Optional file
    portfolio: Joi.array().items(Joi.object({
        image: Joi.string().required(),
        title: Joi.string().required(),
        description: Joi.string().optional(),
      })).optional(),
});

export const bidSumissionSchema = Joi.object({
    jobId: Joi.string().pattern(/^[a-fA-F0-9]{24}$/).required(), 
    freelancerId: Joi.string().pattern(/^[a-fA-F0-9]{24}$/).required(), // userID is required
    bidAmount:Joi.number().positive().required(),
    deliveryDays:Joi.number().positive().required(),
    proposal: Joi.string().pattern(/^\S.*\S$/).required(),
});


export const editBidSumissionSchema = Joi.object({
    _id: Joi.string().pattern(/^[a-fA-F0-9]{24}$/).optional(), 
    freelancerId: Joi.string().pattern(/^[a-fA-F0-9]{24}$/).optional(), // userID is required
    bidAmount:Joi.number().positive().optional(),
    deliveryDays:Joi.number().positive().optional(),
    proposal: Joi.string().pattern(/^\S.*\S$/).optional(),
});