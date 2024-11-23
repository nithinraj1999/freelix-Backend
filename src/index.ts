import express, { Application } from 'express';
import { connectToMongoDB } from "./infrastructure/database/mongodbConnection";
import userRoutes from './interfaces/routes/userRoute';
import adminRoute from './interfaces/routes/adminRoute';
import freelancerRoute from './interfaces/routes/freelancerRoute';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Server, Socket } from 'socket.io';
import { createServer } from 'node:http';
import { initSocket } from './application/services/socket';
import morgan from "morgan"
dotenv.config(); 
  

const port = process.env.PORT 
const app: Application = express();
const server = createServer(app); 

const io = initSocket(server);

app.use(cors({
    origin: process.env.ORIGIN, 
    methods: ['GET', 'POST'],
    credentials: true,
  },
));

app.use(morgan("tiny"))
  
app.use(cookieParser());  
app.use(cors({
  origin: process.env.ORIGIN, 
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: true }));

connectToMongoDB();

app.use('/api', userRoutes);
app.use('/api/admin', adminRoute);
app.use('/api/freelancer', freelancerRoute);

export { io }; 

server.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
