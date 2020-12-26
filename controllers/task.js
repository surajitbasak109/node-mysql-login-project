const { getUser } = require('../helper/user_helper');
const db = require('../database');

// list all tasks
exports.index = (req, res) => {
  const token = req.cookies.jwt;
  getUser(token, (user) => {
    db.query(
      'SELECT * FROM tasks WHERE user_id = ?',
      [user.id],
      (err, tasks) => {
        console.log(tasks);
        res.render('task/index', {
          title: 'Tasks',
          authorized: true,
          user,
          tasks,
          active: { task: true },
          successMsg: req.flash('success-msg'),
        });
      }
    );
  });
};

// create task
exports.create = (req, res) => {
  const token = req.cookies.jwt;
  console.log(req.flash('error'));
  getUser(token, (user) => {
    res.render('task/create', {
      title: 'Create Task',
      authorized: true,
      user,
      active: { task: true },
      error: req.flash('error'),
    });
  });
};

// store task
exports.store = (req, res) => {
  const token = req.cookies.jwt;
  getUser(token, (result) => {
    const { name, description } = req.body;

    if (name === '') {
      req.flash('error', {
        name: 'Name field is required',
      });
      return res.redirect('/tasks/create');
    }

    db.query(
      'INSERT INTO tasks SET ?',
      {
        name,
        description,
        user_id: result.id,
        created_at: new Date(),
      },
      (err, results) => {
        if (err) {
          console.error(err);
        } else {
          req.flash('success-msg', 'Task created successfully');
          res.redirect('/tasks');
        }
      }
    );
  });
};

// edit task
exports.edit = (req, res) => {
  const token = req.cookies.jwt;
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      error: 'Bad request',
    });
  }
  getUser(token, (user) => {
    db.query(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [id, user.id],
      (err, task) => {
        if (err) {
          console.error(err);
          return res.status(404).status({
            error: 'Not found',
          });
        } else {
          console.log(task);
          res.render('task/edit', {
            title: 'Edit Task',
            authorized: true,
            user,
            task: task[0],
            active: { task: true },
            error: req.flash('error'),
          });
        }
      }
    );
  });
};

// update task
exports.update = (req, res) => {
  const token = req.cookies.jwt;
  getUser(token, (user) => {
    const { name, description } = req.body;

    if (name === '') {
      req.flash('error', {
        name: 'Name field is required',
      });
      return res.redirect(`/tasks/edit/${req.params.id}`);
    }

    db.query(
      'UPDATE tasks SET name = ?, description = ?, updated_at = ? WHERE id = ? AND user_id = ?',
      [name, description, new Date(), req.params.id, user.id],
      (err, results) => {
        if (err) {
          console.error(err);
        } else {
          req.flash('success-msg', 'Task updated successfully');
          res.redirect('/tasks');
        }
      }
    );
  });
};

// delete task
exports.delete = (req, res) => {
  const token = req.cookies.jwt;
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      error: 'Bad request',
    });
  }
  getUser(token, (user) => {
    db.query(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [id, user.id],
      (err, task) => {
        if (err) {
          console.log(err);
          req.flash('error-msg', 'Server error');
          return res.redirect('/tasks');
        } else {
          console.log(task);
          req.flash('success-msg', 'Task deleted successfully');
          return res.redirect('/tasks');
        }
      }
    );
  });
};
