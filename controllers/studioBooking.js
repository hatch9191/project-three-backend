import Studio from '../models/studio.js'
import { NotFound, Unauthorized } from '../lib/errors.js'


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


// async function studioBooking(req, res, next) {
//   const { studioId } = req.params
//   const { currentUserId, currentUser } = req
//   try {
//     const studioToBook = await Studio.findById(studioId).populate('bookings.bookedBy')

//     if (!studioToBook) throw new NotFound()

//     if (studioToBook.bookings.bookedBy.find(user => currentUserId.equals(user._id))) {
//       studioToBook.bookings.bookedBy.remove(currentUserId)
//     } else {
//       studioToBook.bookings.bookedBy.push(currentUser)
//     }

//     await studioToBook.save()
//     console.log(studioToBook.bookings.bookedBy)
//     return res.status(202).json(studioToBook)
//   } catch (err) {
//     next(err)
//   }
// }

// * STUDIO TO BOOK

async function studioBooking(req, res, next) {
  const { studioId } = req.params
  const { currentUser } = req
  try {
    const studioToBook = await Studio.findById(studioId)
    if (!studioToBook) {
      throw new NotFound()
    }
    const bookedStudio = studioToBook.bookings.create({ ...req.body, bookedBy: currentUser })
    studioToBook.bookings.push(bookedStudio)
    await studioToBook.save()
    return res.status(201).json(bookedStudio)
  } catch (err) {
    next(err)
  }
}

// * STUDIO TO CANCEL

async function studioCancelling(req, res, next) {
  const { studioId, bookingId } = req.params
  const { currentUserId } = req
  try {
    const studio = await Studio.findById(studioId)
    if (!studio) {
      throw new NotFound()
    }
    const bookingToCancel = studio.bookings.id(bookingId)
    if (!bookingToCancel) {
      throw new NotFound()
    }
    if (!bookingToCancel.bookedBy.equals(currentUserId)) {
      throw new Unauthorized()
    }
    bookingToCancel.remove()
    await studio.save()
    return res.sendStatus(204)
  } catch (err) {
    next(err)
  }
}


export default {
  favourite: studioFavourited,
  booked: studioBooking,
  cancelled: studioCancelling,
}