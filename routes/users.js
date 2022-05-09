const express = require('express');
const { check, validationResult } = require('express-validator');
const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils');
const bcrypt = require('bcryptjs')
const router = express.Router();
const { loginUser, logoutUser } = require('../auth');


router.get('/user/register', csrfProtection, (req, res) => {
  const user = db.User.build();
  res.render('user-register', {
    title: 'Register',
    user,
    csrfToken: req.csrfToken(),
  });
});

const loginValidators = [
  check('email')
    .exists({ checkFalsy: true })
    .withMessage('Please provide an Email Address'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a Password')
];

router.get('/login', csrfProtection, (req, res) => {
  res.render('user-login', {csrfToken: req.csrfToken(), title:"Login Page"})
})

router.post('/login',csrfProtection, loginValidators, asyncHandler(async (req, res) => {
  const {email, password} = req.body
  console.log(req.body)
  const validatorErrors = validationResult(req);
  if (validatorErrors.isEmpty()) {
      let user = await db.User.findOne({where: {email}})
          if(user){
              const result = await bcrypt.compare(password, user.hashedPassword.toString())
              console.log(result)
              if(result){
                  loginUser(req, res, user)
                  res.redirect('/')
              }else{
                  res.render('user-login', {
                      title: 'Login Page',
                      csrfToken: req.csrfToken(),
                      errors: ["Email or Password did not match records."]
                    });
              }
          }
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.render('user-login', {
          title: 'Login Page',
          csrfToken: req.csrfToken(),
          errors
        });
    }
}))

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
