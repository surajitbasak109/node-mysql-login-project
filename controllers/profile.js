const { getUser } = require('../helper/user_helper');
const db = require('../database');

// list all tasks
exports.index = (req, res) => {
  const token = req.cookies.jwt;
  getUser(token, (user) => {
    res.render('profile/index', {
      title: 'Your profile',
      authorized: true,
      user,
      successMsg: req.flash('success-msg'),
    });
  });
};

// update task
exports.update = (req, res) => {
  const token = req.cookies.jwt;
  getUser(token, (user) => {
    
  });
};
