import Studio from '../models/studio.js'
import { connectDb, disconnectDb, truncateDb } from './helpers.js'

async function seed() {
  try {
    await connectDb()
    console.log('⚡️ Database Connected')

    await truncateDb()
    console.log('🗑  Database Cleared')

    const studio = await Studio.create(studioData)
    console.log(`🎤 ${studio.length} Studios added to the database`)

    console.log('👋 Goodbye')
  } catch (err) {
    console.log('💔 Something went wrong')
    console.log(err)
  }
  disconnectDb()
}

seed()