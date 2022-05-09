const express = require('express');
const { check, validationResult } = require('express-validator');
const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils');
const bcrypt = require('bcryptjs')
const router = express.Router();
const { loginUser, logoutUser } = require('../auth');

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

module.exports = router;
