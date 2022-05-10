const express = require('express');
const router = express.Router();

const { requireAuth } = require('../auth')

const { csrfProtection, asyncHandler } = require('./utils');
const { check, validationResult } = require('express-validator');
const db = require('../db/models');

router.get('/', csrfProtection, requireAuth, asyncHandler(async(req, res) => {
  // const questions = await db.Question.findAll();
  const tags = await db.Tag.findAll();
  res.render('question-form', {
    title: 'Questions',
    tags,
    csrfToken: req.csrfToken(),
   });
}));

/* Question Validators */
const questionValidators = [
  check('title')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a question title'),
  check('content')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Password')
    .isLength({ max: 255 })
    .withMessage('Question body must not be more than 500 characters'),
  check('media')
    .isString(),
];

router.post('/', csrfProtection, questionValidators, requireAuth, asyncHandler(async(req, res) => {


  const { title, content, tagId, media } = req.body;
  console.log(req.body)
  // const tag = await db.Tag.b
  const userId = req.session.auth.userId


  const question = db.Question.build({
    title,
    content,
    userId,
    tagId,
    media
   });

   const tags = db.Tag.findAll()
   console.log(tags)
   console.log('hehehehehehehe')
   console.log(question)
   const validatorErrors = validationResult(req);

   if (validatorErrors.isEmpty()) {
    await question.save();
    res.redirect(`/`);
  } else {
    const errors = validatorErrors.array().map((error) => error.msg);
    res.render('question-form', {
      title: 'Submit Question',
      question,
      errors,
      tags,
      csrfToken: req.csrfToken(),
    });
  }

}))

module.exports = router;
