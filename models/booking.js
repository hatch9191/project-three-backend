import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'

const bookingSchema = new mongoose.Schema(
  {
    bookedBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    bookedFrom: { type: String, required: true },
    bookedTo: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

bookingSchema.set('toJSON', { virtuals: true })

bookingSchema.plugin(mongooseUniqueValidator)

const Booking = mongoose.model('Booking', bookingSchema)

export default Booking