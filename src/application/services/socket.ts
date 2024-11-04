// infrastructure/socket.ts
import { Server, Socket } from 'socket.io';
import { createServer } from 'node:http';
import { Server as HttpServer } from 'http'; // Import HttpServer type
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

export const userSocketMap = new Map<string, string>();

// Explicitly define the type of server as HttpServer
export const initSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.ORIGIN, // Your frontend origin
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    socket.on('registerUser', (userId: string) => {
      userSocketMap.set(userId, socket.id); // Associate userId with socket.id
      console.log(`User registered: ${userId} with socket ID: ${socket.id}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
      // Remove user from map on disconnect
      userSocketMap.forEach((value, key) => {
        if (value === socket.id) {
          userSocketMap.delete(key);
          console.log(`User unregistered: ${key}`);
        }
      });
    });
  });

  return io; // Return the io instance
};
