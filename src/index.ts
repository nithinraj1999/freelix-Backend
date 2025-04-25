
import express, { Application } from 'express'
import dotenv from 'dotenv'

dotenv.config()

import { connectToMongoDB } from './infrastructure/database/mongodbConnection'
import userRoute from './interfaces/routes/userRoutes/userRoute'
import authRoute from './interfaces/routes/userRoutes/authRoutes'
import jobPostRoute from './interfaces/routes/userRoutes/jobPostRoutes'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { createServer } from 'node:http'
import { initSocket } from './application/services/socket'
import morgan from 'morgan'
import bidRoute from "./interfaces/routes/userRoutes/bidRoute"
import notificationRoute from "./interfaces/routes/userRoutes/notificationRoute"
import orderRoute from "./interfaces/routes/userRoutes/orderRoute"
import paymentRoute from "./interfaces/routes/userRoutes/paymentRoute"
import chatRoute from './interfaces/routes/userRoutes/chatRoute'
import reviewRoute from "./interfaces/routes/userRoutes/reviewRoute"

//-------
import freelancerBidRoutes from './interfaces/routes/freelancerRoutes/freelancerBidRoutes'
import freelancerJobPostRoutes from './interfaces/routes/freelancerRoutes/freelancerJobPostRoutes'
import freelancerOrderRoutes from "./interfaces/routes/freelancerRoutes/freelancerOrderRouters"
import freelancerRoutes from './interfaces/routes/freelancerRoutes/freelancerRoute'
import freelancerWalletRoutes from './interfaces/routes/freelancerRoutes/freelancerWallet'
import freelancerReviewRoutes from './interfaces/routes/freelancerRoutes/freelancerReview'
//------

import adminAuthRoutes from './interfaces/routes/adminRoutes/adminAuthRoutes'
import adminClientRoutes from './interfaces/routes/adminRoutes/adminClientRoutes'
import adminFreelancerRoutes from './interfaces/routes/adminRoutes/adminFreelancerRoutes'
import adminSkillsRoutes from './interfaces/routes/adminRoutes/adminSkillRoutes'
import adminDashboardRoutes from './interfaces/routes/adminRoutes/adminDashboardRoutes'




//-----

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

// app.use('/api/admin',adminRoute)


app.use('/api/admin', adminAuthRoutes)
app.use('/api/admin', adminClientRoutes)
app.use('/api/admin', adminFreelancerRoutes)
app.use('/api/admin', adminSkillsRoutes)
app.use('/api/admin', adminDashboardRoutes)



app.use('/api/freelancer', freelancerRoutes)
app.use('/api/freelancer', freelancerBidRoutes)
app.use('/api/freelancer', freelancerJobPostRoutes)
app.use('/api/freelancer', freelancerOrderRoutes)
app.use('/api/freelancer', freelancerWalletRoutes)
app.use('/api/freelancer', freelancerReviewRoutes)



export { io }

server.listen(port, () => {
    console.log(`Server running on port ${port}...`)
})
