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
  const id = req.params.id
  console.log(req.params, '----------------------')
  res.render('comment-form', {title: 'Create New Comment', csrfToken: req.csrfToken(), id })
}));

router.post('/answer/comments/:id', requireAuth, csrfProtection, asyncHandler( async (req, res, next) => {
  const {content} = req.body
  const answerId = req.params.id
  const userId = req.session.auth.userId
   const comment = db.Comment.build({
        content,
        answerId,
        userId
    });
    const validatorErrors = validationResult(req);
        if (validatorErrors.isEmpty()) {
          await comment.save();
          res.redirect('/');
      } else {
        const errors = validatorErrors.array().map((error) => error.msg);
        res.render('comment-form', {
            title: 'Create New Comment',
            csrfToken: req.csrfToken(),
            errors
          });
      }
}));

module.exports = router;
