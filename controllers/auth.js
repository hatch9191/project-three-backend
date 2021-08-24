import { Unauthorized, NotFound } from '../lib/errors.js'
import User from '../models/user.js'
import { secret } from '../config/environment.js'
import jwt from 'jsonwebtoken'

async function register(req, res, next) {
  try {
    const user = await User.create(req.body)
    return res.status(201)
      .json({ message: `Welcome ${user.username}` })
  } catch (err) {
    next(err)
  }
}

async function login(req, res, next) {
  try {
    const userToLogin = await User.findOne({ email: req.body.email })
    const payload = { sub: userToLogin._id }
    const options = { expiresIn: '7days' }

    if (!userToLogin || !userToLogin.validatePassword(req.body.password)) {
      throw new Unauthorized()
    }
    const token = jwt.sign(payload, secret, options)

    return res.status(202).json({
      message: `Welcome back ${userToLogin.username}`,
      token, 
    }) 
  } catch (err) {
    next(err)
  }
}

async function profileShow(req, res, next) {
  const { currentUserId } = req
  try {
    const user = await User.findById(currentUserId)
      .populate('favouritedStudio')
      .populate('addedStudio')
      .populate('bookedStudio')
    if (!user) throw new NotFound()
    return res.status(200).json(user)
  } catch (err) {
    next(err)
  }
}

async function profileUpdate(req, res, next) {
  const { currentUserId } = req
  try {
    const userToEdit = await User.findById(currentUserId)
    if (!currentUserId) throw new NotFound()

    Object.assign(userToEdit, req.body)
    await userToEdit.save()
    return res.status(202).json(userToEdit)
  } catch (err) {
    next(err)
  }
}

export default { register, login, profileShow, profileUpdate }