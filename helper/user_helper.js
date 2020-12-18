const db = require('../database')
const jwt = require('jsonwebtoken')

exports.getUser = (token, cb) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  const userId = decoded.id

  db.query('SELECT name, email, last_login FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.log(err)
    }

    if (results.length > 0) {
      return cb(results[0])
    }
  })
}
