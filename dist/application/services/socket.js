"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = exports.userSocketMap = void 0;
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const message_1 = __importDefault(require("../../infrastructure/models/message"));
dotenv_1.default.config();
exports.userSocketMap = new Map();
const initSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.ORIGIN, // Your frontend origin
            methods: ['GET', 'POST'],
            credentials: true,
        },
        transports: ['websocket'],
    });
    io.on('connection', (socket) => {
        socket.on('registerUser', (userId) => {
            exports.userSocketMap.set(userId, socket.id); // Associate userId with socket.id
            console.log(`User registered: ${userId} with socket ID: ${socket.id}`);
        });
        socket.on('disconnect', () => {
            console.log('User disconnected');
            // Remove user from map on disconnect
            exports.userSocketMap.forEach((value, key) => {
                if (value === socket.id) {
                    exports.userSocketMap.delete(key);
                    console.log(`User unregistered: ${key}`);
                }
            });
        });
        socket.on('sendMessage', (message) => __awaiter(void 0, void 0, void 0, function* () {
            const { senderId, recipientId, text, name, timestamp } = message;
            try {
                const newMessage = new message_1.default({
                    senderId,
                    recipientId,
                    text,
                    timestamp,
                });
                yield newMessage.save();
                const recipientSocketId = exports.userSocketMap.get(recipientId);
                if (recipientSocketId) {
                    io.to(recipientSocketId).emit('receiveMessage', {
                        name,
                        senderId,
                        text,
                        timestamp,
                        recipientId,
                    });
                    console.log(`Message sent to recipient: ${recipientId}`);
                }
                else {
                    console.log(`Recipient ${recipientId} is not online.`);
                }
                // Optionally, emit confirmation to the sender
                socket.emit('messageDelivered', { success: true });
            }
            catch (error) {
                console.error('Error saving or sending message:', error);
                socket.emit('messageDelivered', {
                    success: false,
                    error: error,
                });
            }
        }));
        socket.on('startVideoCall', ({ senderId, recipientId, roomId }) => {
            const recipientSocketId = exports.userSocketMap.get(recipientId);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('incomingVideoCall', {
                    roomId,
                    senderId,
                });
                console.log(`Video call invitation sent to recipient: ${recipientId}`);
            }
            else {
                console.log(`Recipient ${recipientId} is not online.`);
            }
        });
        socket.on('blockFreelancer', (userId) => {
            io.emit('freelancerBlocked', userId);
        });
        socket.on('unblockFreelancer', (userId) => {
            io.emit('freelancerUnblocked', userId);
        });
        socket.on('blockClient', (userId) => {
            io.emit('clientBlocked', userId);
        });
        socket.on('unblockClient', (userId) => {
            io.emit('clientUnblocked', userId);
        });
    });
    return io; // Return the io instance
};
exports.initSocket = initSocket;
