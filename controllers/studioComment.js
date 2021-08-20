import Studio from '../models/studio.js'
import { NotFound, Unauthorized } from '../lib/errors.js'

// * STUDIO COMMENT CREATE

async function studioCommentCreate(req, res, next) {
  const { studioId } = req.params
  const { currentUser } = req
  try {
    const commentedStudio = await Studio.findById(studioId)
    if (!commentedStudio) throw new NotFound()

    const createdComment = commentedStudio.comments.create({ ...req.body, addedBy: currentUser })
    commentedStudio.comments.push(createdComment)
    await commentedStudio.save()
    return res.status(201).json(createdComment)
  } catch (err) {
    next(err)
  }
}

// * STUDIO COMMENT DELETE

async function studioCommentDelete(req, res, next) {
  const { studioId, commentId } = req.params
  const { currentUserId } = req
  try {
    const studio = await Studio.findById(studioId)
    if (!studio) throw new NotFound()
    const commentToDelete = studio.comments.id(commentId)
    console.log(commentToDelete)
    if (!commentToDelete) throw new NotFound()

    if (!commentToDelete.addedBy.equals(currentUserId)) {
      throw new Unauthorized()
    }

    await commentToDelete.remove()
    await studio.save()
    return res.sendStatus(204)
  } catch (err) {
    next(err)
  }
}

export default {
  commentCreate: studioCommentCreate,
  commentDelete: studioCommentDelete,
}