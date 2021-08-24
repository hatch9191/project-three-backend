import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'


const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, maxlength: 300 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    addedBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  }
)

const bookingSchema = new mongoose.Schema(
  {
    bookedBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    bookedFrom: { type: String, required: true },
    bookedTo: { type: String, required: true },
    studioId: { type: mongoose.Schema.ObjectId, ref: 'Studio' },
  },
  {
    timestamps: true,
  }
)

const studioSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true, maxlength: 1000 },
  mainImage: { type: String, required: true },
  extraImages: [{ type: String, require: false }],
  location: {
    addressLineOne: { type: String, required: true },
    addressLineTwo: { type: String, required: false },
    postCode: { type: String, required: true },
    town: { type: String, required: true },
    country: { type: String, required: true },
    continent: { type: String, required: true },
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
  },
  size: { type: Number, required: true, min: 1, max: 3 },
  equipment: {
    guitars: { type: Boolean, required: true },
    drums: { type: Boolean, required: true },
    synthesizers: { type: Boolean, required: true },
    microphones: { type: Boolean, required: true },
    mixingDesk: { type: Boolean, required: true },
  },
  rate: { type: Number, required: true, min: 1, max: 3 },
  accommodation: { type: Boolean, required: true },
  noOfStudios: { type: Number, required: true, min: 1 },
  genres: [{ type: String, required: true }],
  previousClients: [{
    name: { type: String, required: false },
    image: { type: String, required: false },
  }],
  availability: [{ type: String, required: false }],
  bookings: [bookingSchema],
  addedBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  favouritedBy: [{ type: mongoose.Schema.ObjectId, ref: 'User', required: true }],
  comments: [commentSchema],
})

studioSchema
  .virtual('avgRating')
  .get(function () {
    if (!this.comments.length) return null

    return this.comments.reduce((acc, currentComment) => {
      return acc + currentComment.rating
    }, 0) / this.comments.length
  })

// studioSchema
//   .virtual('totalBookedBy')
//   .get(function () {
//     return this.bookedBy.length
//   })

studioSchema.set('toJSON', { virtuals: true })

studioSchema.plugin(mongooseUniqueValidator)

const Studio = mongoose.model('Studio', studioSchema)

export default Studio