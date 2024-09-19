import express from "express";
import { connectToMongoDB } from "./infrastructure/database/mongodbConnection";
import userRoutes from './interfaces/routes/userRoute';
import dotenv from 'dotenv';

const port = 5000;
const app = express(); 

dotenv.config();
connectToMongoDB()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', userRoutes);

app.listen(port, () => console.log(`Server started... `));