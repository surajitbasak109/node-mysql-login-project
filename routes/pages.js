const express = require('express')
const admin = require('../controllers/admin')
const { authorized } = require('../middlewares/auth')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('index')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/logout', (req, res) => {
  res.clearCookie('jwt')
  return res.redirect('/login')
})

// protected routes
router.get('/home', authorized, admin.home)

module.exports = router
