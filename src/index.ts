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
dotenv.config(); // Load environment variables
  

const port = process.env.PORT 
const app: Application = express();
const server = createServer(app); // Create HTTP server

const io = initSocket(server);

// Initialize Socket.IO

app.use(cors({
    origin: process.env.ORIGIN, // Your frontend origin
    methods: ['GET', 'POST'],
    credentials: true,
  },
));

app.use(morgan("tiny"))
  
// Apply middlewares
app.use(cookieParser());  
app.use(cors({
  origin: process.env.ORIGIN, 
  credentials: true, // Allow credentials (cookies)
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: true }));

// Database connection
connectToMongoDB();

// Define routes
app.use('/api', userRoutes);
app.use('/api/admin', adminRoute);
app.use('/api/freelancer', freelancerRoute);

export { io }; // Export the io instance

// Start the server using 'server.listen' to include Socket.IO
server.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
