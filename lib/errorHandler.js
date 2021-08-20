export default function errorHandler(err, _req, res, next) {
  console.log(`💔 Something went wrong
  Error: ${err.name}
  `)
  console.log(err.stack)

  if (err.name === 'CastError' || err.name === 'NotFound') {
    return res.status(404).json({ message: 'Not Found' })
  }

  if (err.name === 'ValidationError') {
    const errors = {}

    for (const key in err.errors) {
      errors[key] = err.errors[key].message
    }
    return res.status(422).json({
      message: 'Form Valdation Error',
      errors,
    })
  }

  if (
    err.name === 'Unauthorized' ||
    err.name === 'JsonWebTokenError' ||
    err.name === 'TokenExpiredError'
  ) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  res.sendStatus(500)
  next(err)

}