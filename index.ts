import express, { Request, Response } from 'express';
import { z } from 'zod';
import Joi from 'joi';

const app = express();
app.use(express.json());

// Zod validation
const zodSchema = z.object({
    name: z.string(),
    age: z.number().int().positive().optional(),
});

app.post('/zod', (req: Request, res: Response) => {
    try {
        const parsedData = zodSchema.parse(req.body);
        res.status(200).json({ message: 'Validated by Zod', data: parsedData });
    } catch (error) {
        res.status(400).json({ message: 'Validation failed', error: error.errors });
    }
});

// Joi validation
const joiSchema = Joi.object({
    name: Joi.string().required(),
    age: Joi.number().integer().positive().required(),
});

app.post('/joi', (req: Request, res: Response) => {
    const { error, value } = joiSchema.validate(req.body);

    if (error) {
        res.status(400).json({ message: 'Validation failed', error: error.details });
    } else {
        res.status(200).json({ message: 'Validated by Joi', data: value });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
