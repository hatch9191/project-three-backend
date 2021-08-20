import mongoose from 'mongoose'

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

const Booking = mongoose.model('Booking', bookingSchema)

export default Booking