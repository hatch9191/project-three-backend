import express from 'express'
import logger from './lib/logger.js'


const app = express()
app.use(express.json())
app.use('/', logger)
