"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Generic validation middleware
const validateSchema = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        console.log(error);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        next();
    };
};
exports.default = validateSchema;
