import { connectDb } from './db/helpers.js'
import { port } from './config/environment.js'
import app from './app.js'

async function startServer() {
  try {
    await connectDb()
    console.log('🔌 Mongoose is connected')
    app.listen(port, () => console.log(`🎧 Listening on Port: ${port}`))
  } catch (err) {
    console.log('💔 Oh no something went wrong')
  }
}

startServer()