import express from 'express'
import cors from 'cors' //* <-- This is new

// import { connectDb } from './db/helpers.js'
import logger from './lib/logger.js'
import router from './config/router.js'
import errorHandler from './lib/errorHandler.js'

const app = express()

app.use(express.json())

app.use(cors())

app.use(logger)

app.use('/api', router)

app.use(errorHandler)

export default app