const db = require('../database')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// Register
exports.register = (req, res) => {
  console.log(req.body)

  const { name, email, password, passwordConfirmation } = req.body

  db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
    if (error) {
      console.log(error)
    }

    if (results.length > 0) {
      return res.render('register', {
        message: { type: 'danger', text: 'That email is already in use' },
      })
    } else if (password !== passwordConfirmation) {
      return res.render('register', {
        message: { type: 'danger', text: 'Password do not match' },
      })
    }

    const hashedPassword = await bcrypt.hash(password, 8)

    db.query(
      'INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, NOW())',
      [name, email, hashedPassword],
      (error, results) => {
        if (error) {
          console.log(error)
        } else {
          // console.log(results)
          return res.render('register', {
            message: { type: 'success', text: 'User registered' },
          })
        }
      }
    )
  })
}

// Login
exports.login = (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).render('login', {
        message: { type: 'danger', text: 'Please provide an email and password' },
      })
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
      console.log(results)
      if (!results.length || !(await bcrypt.compare(password, results[0].password))) {
        res.status(401).render('login', {
          message: { type: 'danger', text: 'Email or password is incorrect' },
        })
      } else {
        const id = results[0].id

        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        })

        // console.log('The token is', token)

        const cookieOptions = {
          expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
          httpOnly: true,
        }

        res.cookie('jwt', token, cookieOptions)
        res.status(200).redirect('/home')
      }
    })
  } catch (error) {
    console.log(error)
  }
}
