import express from 'express'
import 'dotenv/config'
import connectDB from './database/db.js'
import authRoute from './routes/authRoute.js'
import websiteRoute from './routes/websiteRoute.js'
import paymentRoute from './routes/paymentRoute.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3000

//middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.NODE_ENV === "production" 
        ? process.env.FRONTEND_URL 
        : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'],
    credentials: true
}))


app.use('/api/auth', authRoute)
app.use('/api/website', websiteRoute)
app.use('/api/payment', paymentRoute)

// Health check endpoint to keep Render server awake
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is awake' })
})


app.listen(PORT, ()=>{
    connectDB()
    console.log(`Server is listening at port : ${PORT}` )
})