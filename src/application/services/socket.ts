import { Server, Socket } from 'socket.io'
import { createServer } from 'node:http'
import { Server as HttpServer } from 'http' // Import HttpServer type
import dotenv from 'dotenv'
import MessageModel from '../../infrastructure/models/message'
dotenv.config()

export const userSocketMap = new Map<string, string>()

export const initSocket = (server: HttpServer) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.ORIGIN, // Your frontend origin
            methods: ['GET', 'POST'],
            credentials: true,
        },
    })

    io.on('connection', (socket: Socket) => {
        socket.on('registerUser', (userId: string) => {
            userSocketMap.set(userId, socket.id) // Associate userId with socket.id
            console.log(
                `User registered: ${userId} with socket ID: ${socket.id}`
            )
        })

        socket.on('disconnect', () => {
            console.log('User disconnected')
            // Remove user from map on disconnect
            userSocketMap.forEach((value, key) => {
                if (value === socket.id) {
                    userSocketMap.delete(key)
                    console.log(`User unregistered: ${key}`)
                }
            })
        })

        socket.on('sendMessage', async (message) => {
            const { senderId, recipientId, text, name, timestamp } = message

            try {
                const newMessage = new MessageModel({
                    senderId,
                    recipientId,
                    text,
                    timestamp,
                })
                await newMessage.save()

                const recipientSocketId = userSocketMap.get(recipientId)
                if (recipientSocketId) {
                    io.to(recipientSocketId).emit('receiveMessage', {
                        name,
                        senderId,
                        text,
                        timestamp,
                        recipientId,
                    })
                    console.log(`Message sent to recipient: ${recipientId}`)
                } else {
                    console.log(`Recipient ${recipientId} is not online.`)
                }

                // Optionally, emit confirmation to the sender
                socket.emit('messageDelivered', { success: true })
            } catch (error) {
                console.error('Error saving or sending message:', error)
                socket.emit('messageDelivered', {
                    success: false,
                    error: error,
                })
            }
        })

        socket.on('startVideoCall', ({ senderId, recipientId, roomId }) => {
            const recipientSocketId = userSocketMap.get(recipientId)
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('incomingVideoCall', {
                    roomId,
                    senderId,
                })
                console.log(
                    `Video call invitation sent to recipient: ${recipientId}`
                )
            } else {
                console.log(`Recipient ${recipientId} is not online.`)
            }
        })

        socket.on('blockFreelancer', (userId) => {
            io.emit('freelancerBlocked', userId)
        })

        socket.on('unblockFreelancer', (userId) => {
            io.emit('freelancerUnblocked', userId)
        })

        socket.on('blockClient', (userId) => {
            io.emit('clientBlocked', userId)
        })

        socket.on('unblockClient', (userId) => {
            io.emit('clientUnblocked', userId)
        })
    })

    return io // Return the io instance
}
