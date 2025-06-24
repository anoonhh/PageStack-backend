import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './db/connectDB.js'
import bookRoute from './routes/book/bookRoute.js'
import authRoute from './routes/auth/authRoute.js'
import userRoute from './routes/user/userRoute.js'



dotenv.config()
const PORT = process.env.PORT || 5000

const app = express()

connectDB()

app.use('/uploads', express.static('uploads'));

app.use(express.json())

app.use(cors())

app.use('/api/book',bookRoute)

app.use('/user',authRoute)


app.use('',userRoute)

app.use((error,req, res,next) => {
    res.status(error.code || 500).json({
        message: error.message || "An unknown error occurred",
    });
});


app.listen(PORT,() => console.log(`Server running on http://localhost:${PORT}`))




