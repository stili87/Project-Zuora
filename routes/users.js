// const express = require('express');
// const router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('../node_modules/bcrypt')
const { loginUser, logoutUser } = require('../auth');

const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils');
const router = express.Router();


router.get('/user/register', csrfProtection, (req, res) => {
  const user = db.User.build();
  res.render('user-register', {
    title: 'Register',
    user,
    csrfToken: req.csrfToken(),
  });
});

const userValidators = [
  check('fullName')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for First Name')
    .isLength({ max: 100 })
    .withMessage('First Name must not be more than 100 characters long'),
  check('email')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Email Address')
    .isLength({ max: 50 })
    .withMessage('Email Address must not be more than 50 characters long')
    .isEmail()
    .withMessage('Email Address is not a valid email')
    .custom((value) => {
      return db.User.findOne({ where: { email: value } })
        .then((user) => {
          if (user) {
            return Promise.reject('The provided Email Address is already in use by another account');
          }
        });
    }),
  check('bio')
    .isLength({ max: 300 })
    .withMessage('Bio must not be more than 300 characters long'),
  check('credentials')
    .isLength({ max: 100 })
    .withMessage('Bio must not be more than 100 characters long'),
  check('picSrc')
    .isLength({ max: 300 })
    .withMessage('Bio must not be more than 300 characters long'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Password')
    .isLength({ max: 50 })
    .withMessage('Password must not be more than 50 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, 'g')
    .withMessage('Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")'),
  check('confirmPassword')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Confirm Password')
    .isLength({ max: 50 })
    .withMessage('Confirm Password must not be more than 50 characters long')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Confirm Password does not match Password');
      }
      return true;
    })
];

router.post('/user/register', csrfProtection, userValidators,
  asyncHandler(async (req, res) => {
    const {
      email,
      hashedPassword,
      fullName,
      bio,
      credentials,
      picSrc
    } = req.body;

    const user = db.User.build({
      email,
      fullName,
      bio,
      credentials,
      picSrc
    });

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      const password = await bcrypt.hash(hashedPassword, 10);
      user.password = password;
      await user.save();
      loginUser(req, res, user);
      res.redirect('/');
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.render('user-register', {
        title: 'Register',
        user,
        errors,
        csrfToken: req.csrfToken(),
      });
    }
  }));

module.exports = router;
