import { NotFound } from '../lib/errors.js'
// import Studio from '../models/studio.js'
import User from '../models/user.js'

async function profile(req, res, next) {
  // const { studioId } = req.params
  const { currentUserId } = req
  try {
    // const studio = await Studio.all(studioId)
    //   .populate('addedBy')
    //   .populate('favouritedBy')
    //   .populate('comments.addedBy')
    //   .populate('bookings.bookedBy')

    const user = User.findById(currentUserId)
      .populate('favouritedStudio')
      .populate('addedStudio')
      .populate('bookedStudio')

    if (!user) throw new NotFound()
    return res.status(200).json(user)
  } catch (err) {
    next(err)
  }
}

export default profile