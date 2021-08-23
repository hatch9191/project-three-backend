import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, minlength: 1, maxlength: 10, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, minlength: 1, required: true },
  acceptTerms: { type: Boolean, required: true },
  isAdmin: { type: Boolean, required: false, default: false },
})

userSchema
  .virtual('favouritedStudio', {
    ref: 'Studio',
    localField: '_id',
    foreignField: 'favouritedBy',
  })
  .get(function (favouritedStudio) {
    if (!favouritedStudio) return

    return favouritedStudio.map(studio => {
      return {
        _id: studio._id,
        name: studio.name,
        mainImage: studio.mainImage,
        town: studio.location.town,
        country: studio.location.country,
      }
    })
  })

userSchema
  .virtual('addedStudio', {
    ref: 'Studio',
    localField: '_id',
    foreignField: 'addedBy',
  })
  .get(function (addedStudio) {
    if (!addedStudio) return

    return addedStudio.map(studio => {
      return {
        _id: studio._id,
        name: studio.name,
        mainImage: studio.mainImage,
        town: studio.location.town,
        country: studio.location.country,
      }
    })
  })

//! Booking ???

userSchema
  .virtual('bookedStudio', {
    ref: 'Studio',
    localField: '_id',
    foreignField: 'bookings.bookedBy',
  })
  .get(function (bookedStudio) {
    if (!bookedStudio) return

    

    return bookedStudio.map(studio => {

      return {
        studioId: studio._id,
        name: studio.name,
        mainImage: studio.mainImage,
        town: studio.location.town,
        country: studio.location.country,
        // bookedFrom: studio.bookings.bookedFrom,
        // bookedTo: studio.bookings.bookedTo,
        bookings: studio.bookings,
      }
    })
  })

// userSchema
//   .virtual('specificBookedStudio', {
//     ref: 'User',
//     localField: '_id',
//     foreignField: 'bookedStudio.bookedBy',
//   })
//   .get(function (specificBookedStudio) {
//     if (!specificBookedStudio) return
//     return specificBookedStudio
//   })

userSchema.set('toJSON', {
  virtuals: true,
  transform(_doc, json) {
    delete json.password
    return json
  },
})

userSchema
  .virtual('passwordConfirmation')
  .set(function (passwordConfirmation) {
    this._passwordConfirmation = passwordConfirmation
  })

userSchema
  .pre('validate', function (next) {
    if (this.isModified('password') &&
      this.password !== this._passwordConfirmation
    ) {
      this.invalidate('passwordConfirmation', 'does not match')
    }
    next()
  })

userSchema
  .pre('save', function (next) {
    if (this.isModified('password')) {
      this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync())
    }
    next()
  })

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

userSchema.plugin(mongooseUniqueValidator)

const User = mongoose.model('User', userSchema)


export default User
