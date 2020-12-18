exports.home = (req, res) => {
  res.render('home', {
    authorized: true,
  })
}
