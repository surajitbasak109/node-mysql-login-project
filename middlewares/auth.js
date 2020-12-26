const jwt = require('jsonwebtoken')

module.exports.authorized = (req, res, next) => {
  const token = req.cookies.jwt
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return next()
  } catch (error) {
    console.log(error)
    const err = {
      error: 'Not authorized! Go back!',
      status: 401
    }
    return res.redirect('/login')
  }
}

module.exports.isPublic = (req, res, next) => {
  const token = req.cookies.jwt
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    res.redirect('/home')
  } catch (error) {
    // console.log(error);
    return next()
  }
}
