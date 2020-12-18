const express = require('express')
const { getUser } = require('../helper/user_helper')
const admin = require('../controllers/admin')
const { authorized, isPublic } = require('../middlewares/auth')
const router = express.Router()

router.get('/', (req, res) => {
  if (req.cookies.jwt) {
    getUser(req.cookies.jwt, result => {
      res.render('index', {
        authorized: true,
        user: result
      })
    })
  } else {
    res.render('index')
  }
})

router.get('/register', isPublic, (req, res) => {
  res.render('register')
})

router.get('/login', isPublic, (req, res) => {
  res.render('login')
})

router.get('/logout', (req, res) => {
  res.clearCookie('jwt')
  return res.redirect('/login')
})

// protected routes
router.get('/home', authorized, admin.home)

module.exports = router
