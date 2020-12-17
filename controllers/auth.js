const db = require('../database')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.register = (req, res) => {
  console.log(req.body)

  const { name, email, password, passwordConfirmation } = req.body

  db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
    if (error) {
      console.log(error)
    }

    if (results.length > 0) {
      return res.render('register', {
        message: { type: 'danger', text: 'That email is already in use' }
      })
    } else if (password !== passwordConfirmation) {
      return res.render('register', {
        message: { type: 'danger', text: 'Password do not match' }
      })
    }

    const hashedPassword = await bcrypt.hash(password, 8)

    db.query('INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, NOW())', [name, email, hashedPassword], (error, results) => {
      if (error) {
        console.log(error)
      } else {
        console.log(results)
        return res.render('register', {
          message: { type: 'success', text: 'User registered' }
        })
      }
    })
  })
}
