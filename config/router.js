import express from 'express'
import studio from '../controllers/studios.js'
import studioBooking from '../controllers/studioBooking.js'
import studioComment from '../controllers/studioComment.js'

const router = express.Router()

router.route('/studios')
  .get(studio.index)
  .post(studio.create)

router.route('/studios/:studioId')
  .get(studio.show)
  .put(studio.update)
  .delete(studio.delete)

router.route('/studios/:studioId/comments')
  .post(studioComment.commentCreate)

router.route('studios/:studioId/comments/:commentId')
  .delete(studioComment.commentDelete)

router.route('studios/:studioId/favourites')
  .post(studioBooking.favourite)

router.route('studios/:studioId/bookings')
  .post(studioBooking.booked)

// LOGIN, REGISTER AND PROFILE TODO


export default router