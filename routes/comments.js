const express = require('express');
const { check, validationResult } = require('express-validator');
const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils');
const router = express.Router();
const { requireAuth } = require('../auth');

const commentValidators = [
  check('content')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a Comment')
    .isLength({max: 500})
    .withMessage('Comment is too long; please shorten'),
];



router.get('/answer/comments/:id', requireAuth, csrfProtection,  asyncHandler( async (req, res, next) => {
  res.render('comment-form', {title: 'Create New Comment', csrfToken: req.csrfToken() })
}));

router.post('/answer/comments/:id', requireAuth, csrfProtection, asyncHandler( async (req, res, next) => {
  const {firstName, lastName, emailAddress, password} = req.body
    const user = db.User.build({
        firstName, lastName, emailAddress
    })
    const validatorErrors = validationResult(req);
        if (validatorErrors.isEmpty()) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.hashedPassword = hashedPassword;
        await user.save();
        loginUser(req, res, user)
        res.redirect('/');
      } else {
        const errors = validatorErrors.array().map((error) => error.msg);
        res.render('user-register', {
            title: 'Add User',
            user,
            csrfToken: req.csrfToken(),
            errors
          });
      }
}));

module.exports = router;
