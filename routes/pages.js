const express = require('express');
const { getUser } = require('../helper/user_helper');
const admin = require('../controllers/admin');
const task = require('../controllers/task');
const profile = require('../controllers/profile');
const { authorized, isPublic } = require('../middlewares/auth');
const db = require('../database');
const moment = require('moment');
const router = express.Router();

router.get('/', (req, res) => {
  db.query(
    'SELECT tsk.id, tsk.`name`as task_name, tsk.description, tsk.user_id, tsk.created_at, usr.`name` as user_name FROM tasks AS tsk INNER JOIN users AS usr ON tsk.user_id = usr.id',
    (err, tasks) => {
      if (err) {
        console.error(err);
      }
      tasks.forEach(task => {
          task.created_at = moment(task.created_at).fromNow()
      });
      if (req.cookies.jwt) {
        getUser(req.cookies.jwt, (user) => {
          res.render('index', {
            authorized: true,
            user,
            tasks,
          });
        });
      } else {
        res.render('index', {
          tasks,
        });
      }
    }
  );
});

router.get('/register', isPublic, (req, res) => {
  res.render('register', {
    active: { register: true },
  });
});

router.get('/login', isPublic, (req, res) => {
  res.render('login', {
    active: { login: true },
  });
});

router.get('/logout', (req, res) => {
  res.clearCookie('jwt');
  return res.redirect('/login');
});

// protected routes
router.get('/home', authorized, admin.home);

// profile
router.get('/profile', authorized, profile.index);
router.get('/profile/edit', authorized, profile.edit);
router.post('/profile/update', authorized, profile.update);

// Tasks
router.get('/tasks', authorized, task.index);
router.get('/tasks/create', authorized, task.create);
router.post('/tasks/store', authorized, task.store);
router.get('/tasks/edit/:id?', authorized, task.edit);
router.post('/tasks/update/:id?', authorized, task.update);
router.post('/tasks/delete/:id?', authorized, task.delete);

module.exports = router;
