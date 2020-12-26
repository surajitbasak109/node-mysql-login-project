const { getUser } = require('../helper/user_helper')

exports.home = (req, res) => {
  const token = req.cookies.jwt
  getUser(token, (result) => {
    res.render('home', {
      title: 'Home',
      authorized: true,
      user: result,
      active: { home: true }
    })
  })
}
