import Studio from '../models/studio.js'
import { NotFound, Unauthorized } from '../lib/errors.js'

// * INDEX

async function studioIndex(_req, res, next) {
  try {
    const studio = await Studio.find()
    return res.status(200).json(studio)
  } catch (err) {
    next(err)
  }
}

// * SHOW

async function studioShow(req, res, next) {
  const { studioId } = req.params
  try {
    const studio = await Studio.findById(studioId)
      .populate('addedBy')
      .populate('favouritedBy')
      .populate('comments.addedBy')
    // .populate('bookings')

    if (!studio) throw new NotFound()
    return res.status(200).json(studio)
  } catch (err) {
    next(err)
  }
}

// * CREATE

async function studioCreate(req, res, next) {
  const { currentUser } = req
  try {
    const newStudio = await Studio.create({ ...req.body, addedBy: currentUser })
    return res.status(201).json(newStudio)
  } catch (err) {
    next(err)
  }
}

// * UPDATE

async function studioUpdate(req, res, next) {
  const { studioId } = req.params
  const { currentUserId } = req
  try {
    const studioToEdit = await Studio.findById(studioId)
    if (!studioToEdit) throw new NotFound()

    if (!studioToEdit.addedBy.equals(currentUserId)) {
      throw new Unauthorized()
    }

    Object.assign(studioToEdit, req.body)
    await studioToEdit.save()
    return res.status(202).json(studioToEdit)
  } catch (err) {
    next(err)
  }
}

// * DELETE

async function studioDelete(req, res, next) {
  const { studioId } = req.params
  const { currentUserId } = req
  try {
    const studioToDelete = await Studio.findById(studioId)
    if (!studioToDelete) throw new NotFound()

    if (!studioToDelete.addedBy.equals(currentUserId)) {
      throw new Unauthorized
    }

    await studioToDelete.remove()
    return res.sendStatus(204)
  } catch (err) {
    next(err)
  }
}

export default {
  index: studioIndex,
  show: studioShow,
  create: studioCreate,
  update: studioUpdate,
  delete: studioDelete,
}
