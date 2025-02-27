import express, { Application } from 'express'
import { connectToMongoDB } from './infrastructure/database/mongodbConnection'
import userRoute from './interfaces/routes/userRoutes/userRoute'
import authRoute from './interfaces/routes/userRoutes/authRoutes'
import adminRoute from './interfaces/routes/adminRoutes/adminRoute'
import jobPostRoute from './interfaces/routes/userRoutes/jobPostRoutes'
import freelacerRoute from './interfaces/routes/freelancerRoutes/freelancerRoute'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { Server, Socket } from 'socket.io'
import { createServer } from 'node:http'
import { initSocket } from './application/services/socket'
import morgan from 'morgan'
import { errorHandlingMiddleware } from './interfaces/middleware/errorHandler'
import bidRoute from "./interfaces/routes/userRoutes/bidRoute"
import notificationRoute from "./interfaces/routes/userRoutes/notificationRoute"
import orderRoute from "./interfaces/routes/userRoutes/orderRoute"
import paymentRoute from "./interfaces/routes/userRoutes/paymentRoute"
import chatRoute from './interfaces/routes/userRoutes/chatRoute'
import reviewRoute from "./interfaces/routes/userRoutes/reviewRoute"
dotenv.config()

const port = process.env.PORT
console.log('port', port)
console.log('mongoURL', process.env.MONGODB_ORIGIN)
const app: Application = express()
const server = createServer(app)

const io = initSocket(server)

app.use(
    cors({
        origin: process.env.ORIGIN,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    })
)

app.use(morgan('tiny'))

app.use(cookieParser())
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ limit: '2mb', extended: true }))

connectToMongoDB()

app.use('/api', authRoute)
app.use('/api',jobPostRoute)
app.use('/api', userRoute)
app.use('/api', bidRoute)
app.use('/api', notificationRoute)
app.use('/api', orderRoute)
app.use('/api', paymentRoute)
app.use('/api', chatRoute)
app.use('/api', reviewRoute)

app.use('/api/admin', adminRoute)
app.use('/api/freelancer', freelacerRoute)

export { io }

server.listen(port, () => {
    console.log(`Server running on port ${port}...`)
})
