import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Generic validation middleware
const validateSchema = (schema: Joi.Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);
        console.log(error);

        console.log(req.body);
        
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        next(); 
    };
};

export default validateSchema;
