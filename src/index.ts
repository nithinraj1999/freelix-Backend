import express from "express";
import { connectToMongoDB } from "./infrastructure/database/mongodbConnection";
import userRoutes from './interfaces/routes/userRoute';
import adminRoute from './interfaces/routes/adminRoute'
import freelancerRoute from './interfaces/routes/freelancerRoute'
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const port = 5000;
const app = express(); 

app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true, // Allow credentials (cookies)
  }));
dotenv.config();
connectToMongoDB()

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: true }));

app.use('/api', userRoutes);
app.use('/api/admin', adminRoute);
app.use('/api/freelancer', freelancerRoute);
app.listen(port, () => console.log(`Server started... `));