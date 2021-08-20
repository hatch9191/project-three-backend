import Studio from '../models/studio.js'
import { NotFound } from '../lib/errors.js'


// * STUDIO FAVORITE TOGGLE

async function studioFavourited(req, res, next) {
  const { studioId } = req.params
  const { currentUserId, currentUser } = req
  try {
    const studioToFavourite = await Studio.findById(studioId).populate('favouritedBy')

    if (!studioToFavourite) throw new NotFound()

    if (studioToFavourite.favouritedBy.find(user => currentUserId.equals(user._id))) {
      studioToFavourite.favouritedBy.remove(currentUserId)
    } else {
      studioToFavourite.favouritedBy.push(currentUser)
    }

    await studioToFavourite.save()
    console.log(studioToFavourite.favouritedBy)
    return res.status(202).json(studioToFavourite)
  } catch (err) {
    next(err)
  }
}

// * STUDIO TO BOOK

async function studioBooking(req, res, next) {
  const { studioId } = req.params
  const { currentUserId, currentUser } = req
  try {
    const studioToBook = await Studio.findById(studioId).populate('bookings.bookedBy')

    if (!studioToBook) throw new NotFound()

    if (studioToBook.bookings.bookedBy.find(user => currentUserId.equals(user._id))) {
      studioToBook.bookings.bookedBy.remove(currentUserId)
    } else {
      studioToBook.bookings.bookedBy.push(currentUser)
    }

    await studioToBook.save()
    console.log(studioToBook.bookings.bookedBy)
    return res.status(202).json(studioToBook)
  } catch (err) {
    next(err)
  }
}

export default {
  favourite: studioFavourited,
  booked: studioBooking,
}