import Studio from '../models/studio.js'
import User from '../models/user.js'
import { connectDb, disconnectDb, truncateDb } from './helpers.js'
import studioData from './data/studios.js'

async function seed() {
  try {
    await connectDb()
    console.log('⚡️ Database Connected')

    await truncateDb()
    console.log('🗑  Database Cleared')

    const user = await User.create({
      username: 'admin',
      email: 'admin@email.com',
      password: 'pass',
      passwordConfirmation: 'pass',
      avatar: 'https://res.cloudinary.com/dn11uqgux/image/upload/v1629317752/sei_project_3_studio_images/Xzibit_tljwir.jpg',
      isAdmin: true,
    })

    console.log('🤖 Admin user created')

    studioData.forEach(studio => {
      studio.addedBy = user
    })

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