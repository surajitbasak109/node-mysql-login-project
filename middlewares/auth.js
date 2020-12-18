const jwt = require('jsonwebtoken')

module.exports.authorized = (req, res, next) => {
  let token = req.cookies.jwt
  try {
    let decoded = jwt.verify(token, process.env.JWT_SECRET)
    return next()
  } catch (error) {
    let err = {
      error: 'Not authorized! Go back!',
      status: 401,
    }
    res.setHeader('Content-Type', 'application/json')
    return res.redirect('/login')
  }
}
