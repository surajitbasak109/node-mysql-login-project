const { getUser } = require('../helper/user_helper');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const db = require('../database');

// user profile
exports.index = (req, res) => {
  const token = req.cookies.jwt;
  getUser(token, (user) => {
    db.query(
      'SELECT * FROM profile WHERE user_id = ?',
      [user.id],
      (err, profile) => {
        res.render('profile/index', {
          title: 'Your profile',
          authorized: true,
          user,
          profile: profile[0],
          successMsg: req.flash('success-msg'),
          old: req.flash('old'),
        });
      }
    );
  });
};

// edit profile
exports.edit = (req, res) => {
  const token = req.cookies.jwt;
  getUser(token, (user) => {
    db.query(
      'SELECT * FROM profile WHERE user_id = ?',
      [user.id],
      (err, profile) => {
        res.render('profile/edit', {
          title: 'Edit profile',
          authorized: true,
          user,
          errors: req.flash('errors'),
          profile: profile[0],
          successMsg: req.flash('success-msg'),
        });
      }
    );
  });
};

// update profile
exports.update = (req, res) => {
  const token = req.cookies.jwt;
  getUser(token, (user) => {
    const form = formidable();
    form.parse(req, (err, fields, files) => {
      if (err) {
        next(err);
        return;
      }

      req.flash('old', fields);
      const {
        name,
        role,
        phone,
        mobile,
        address,
        bio,
        website,
        github,
        twitter,
        instagram,
        facebook,
      } = fields;

      if (name === '') {
        req.flash('error', {
          name: 'Name field is required',
        });
        redirect('/profile/edit');
      }

      db.query(
        'SELECT image FROM profile WHERE user_id = ?',
        [user.id],
        (err, userImage) => {
          if (err) {
            console.error(err);
            return res.staus(500).json({
              error: 'Server error',
            });
          } else {
            if (files.image) {
              const allowedExts = ['jpeg', 'jpg', 'png', 'gif'];
              const fileType = files.image.type.split('/').pop();
              if (allowedExts.includes(fileType)) {
                const oldPath = files.image.path;
                let image = uuidv4() + '.' + fileType;
                const newPath =
                  path.join(__dirname, '../public/uploads/') + image;
                const rawData = fs.readFileSync(oldPath);
                fs.writeFile(newPath, rawData, (err) => {
                  if (err) console.error(err);
                  db.query(
                    'UPDATE users SET name = ? WHERE id = ?',
                    [name, user.id],
                    (err, updatedUser) => {
                      if (err) console.error(err);
                    }
                  );
                  db.query(
                    'UPDATE profile SET image = ?, role = ?, phone = ?, mobile = ?, address= ?, bio = ?, website = ?, github = ?, twitter = ?, instagram = ?, facebook = ? WHERE user_id = ?',
                    [
                      image,
                      role,
                      phone,
                      mobile,
                      address,
                      bio,
                      website,
                      github,
                      twitter,
                      instagram,
                      facebook,
                      user.id,
                    ],
                    (err, newProfile) => {
                      if (err) {
                        console.error(err);
                        return res.status(500).json({
                          error: 'Server error',
                        });
                      } else {
                        req.flash(
                          'success-msg',
                          'Profile updated successfully'
                        );
                        return res.redirect('/profile');
                      }
                    }
                  );
                });
              } else {
                req.flash('errors', {
                  image: 'Use valid image type (e.g. jpeg, jpg, png, gif)',
                });
                return res.redirect('/profile/edit');
              }
            } else {
              let image = userImage[0].image;
              db.query(
                'UPDATE users SET name = ? WHERE id = ?',
                [name, user.id],
                (err, updatedUser) => {
                  if (err) console.error(err);
                }
              );
              db.query(
                'UPDATE profile SET image = ?, role = ?, phone = ?, mobile = ?, address= ?, bio = ?, website = ?, github = ?, twitter = ?, instagram = ?, facebook = ? WHERE user_id = ?',
                [
                  image,
                  role,
                  phone,
                  mobile,
                  address,
                  bio,
                  website,
                  github,
                  twitter,
                  instagram,
                  facebook,
                  user.id,
                ],
                (err, newProfile) => {
                  if (err) {
                    console.error(err);
                    return res.status(500).json({
                      error: 'Server error',
                    });
                  } else {
                    req.flash('success-msg', 'Profile updated successfully');
                    return res.redirect('/profile');
                  }
                }
              );
            }
          }
        }
      );
    });
  });
};
