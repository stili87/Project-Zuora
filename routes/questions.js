const express = require('express');
const router = express.Router();

const { requireAuth } = require('../auth')

const { csrfProtection, asyncHandler } = require('./utils');
const { check, validationResult } = require('express-validator');
const db = require('../db/models');

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

router.get('/', csrfProtection, requireAuth, asyncHandler(async(req, res) => {
  const questions = await db.Question.findAll();
  const tags = await db.Tag.findAll();
  res.render('questions', {
    title: 'Questions',
    questions,
    csrfToken: req.csrfToken(),
   });
}));


router.get('/add', csrfProtection, requireAuth, asyncHandler(async(req, res) => {
  const questions = await db.Question.findAll();
  const tags = await db.Tag.findAll();
  res.render('question-form', {
    title: 'Questions',
    questions,
    tags,
    csrfToken: req.csrfToken(),
   });
}));

router.post('/', csrfProtection, questionValidators, requireAuth, asyncHandler(async(req, res) => {


  const { title, content, tagId, media } = req.body;
  console.log(req.body)

  const userId = req.session.auth.userId


  const question = db.Question.build({
    title,
    content,
    userId,
    tagId,
    media
   });

   const tags = db.Tag.findAll()

   const validatorErrors = validationResult(req);

   if (validatorErrors.isEmpty()) {
    await question.save();
    res.redirect('/questions');
  } else {
    const errors = validatorErrors.array().map((error) => error.msg);
    res.render('question-form', {
      title: 'Submit Question',
      // question,
      errors,
      tags,
      csrfToken: req.csrfToken(),
    });
  }

}));

router.get('/questions', csrfProtection, requireAuth, asyncHandler(async(req, res) => {
  const questions = await db.Question.findAll();
  res.render('questions', {
    questions,
    csrfToken: req.csrfToken(),
  })
}));

router.get('/:questionId/edit', csrfProtection, requireAuth, asyncHandler(async(req, res) => {

    const questionId = parseInt(req.params.questionId, 10);
    console.log('questionID below !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    console.log(questionId)
  const question = db.Question.findByPk(questionId);

  res.render('question-edit', {
    title: "Question Edit",

    csrfToken: req.csrfToken(),

  })

}))

router.post('/:questionId/edit', csrfProtection, requireAuth, questionValidators, asyncHandler(async(req, res) => {

  const userId = req.session.auth.userId
  console.log('REQ.PARAMS HERE')
  console.log(req.params)
  const questionId = parseInt(req.params.questionId, 10);

  console.log('question ID below')
  console.log(questionId)

  const question = await db.Question.findByPk(questionId);

  const { title, content, media } = req.body
  console.log('WE MADE IT HERE')
  console.log(question)

  let editedQuestion = await question.update({ title, content, media })
  console.log(editedQuestion)

  const validatorErrors = validationResult(req);

  if (validatorErrors.isEmpty()) {
   await editedQuestion.save();
   res.redirect("/questions")
 } else {
   const errors = validatorErrors.array().map((error) => error.msg);
   res.render('question-edit', {
     title: 'Edit Question',
     question,
     questionId,
     errors,
     csrfToken: req.csrfToken(),
   });
 }
}));


router.get('/:questionId/delete', requireAuth, asyncHandler(async(req, res) => {
  const id = req.params.questionId;
  res.render('testing', {
    id
  })
}))

router.post('/:questionId/delete', requireAuth, questionValidators,
  asyncHandler(async function (req, res) {
    const { questionId } = req.params;
    const question = await db.Question.findByPk(questionId);
  // const validatorErrors = validationResult(req);

  //  const errors = validatorErrors.array().map((error) => error.msg);

    if (question){

      await question.destroy()

    } else {
      console.log('it didnt work')
    }
    res.render('testing')
  })
);

module.exports = router;
