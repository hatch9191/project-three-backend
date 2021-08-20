import express from 'express'
import studio from '../controllers/studios.js'
import studioBooking from '../controllers/studioBooking.js'
import studioComment from '../controllers/studioComment.js'
import secureRoute from '../lib/secureRoute.js'
import auth from '../controllers/auth.js'

const router = express.Router()

router.route('/studios')
  .get(studio.index)
  .post(secureRoute, studio.create)

router.route('/studios/:studioId')
  .get(studio.show)
  .put(secureRoute, studio.update)
  .delete(secureRoute, studio.delete)

router.route('/studios/:studioId/comments')
  .post(secureRoute, studioComment.commentCreate)

router.route('/studios/:studioId/comments/:commentId')
  .delete(secureRoute, studioComment.commentDelete)

router.route('/studios/:studioId/favourites')
  .post(secureRoute, studioBooking.favourite)

router.route('/studios/:studioId/bookings')
  .post(secureRoute, studioBooking.booked)

router.post('/register', auth.register)
router.post('/login', auth.login)

// router.route('/profile')
//   .get(secureRoute, auth.profile)

// LOGIN, REGISTER AND PROFILE TODO


export default router