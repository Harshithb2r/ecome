import express from 'express'
import dotenv from 'dotenv'

import morgan from 'morgan'
import connectDB from './config/db.js'

import authRouter from './routes/authrouter.js'
import cors from 'cors'

import path from 'path'


dotenv.config()
connectDB()
const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan("dev"))
app.use(express.static(path.join(__dirname, './client/build')))

app.use('/api/v1/auth', authRouter)

app.use('*',function(req,res){
    res.sendFile(path.join(__dirname, "./client/build/index.html"))
})


const PORT = process.env.PORT || 8080;

app.listen(PORT, ()=>{
    console.log(`server running on ${process.env.DEV_MODE} and ${PORT}`)
})