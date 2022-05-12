const express = require('express');
const { check, validationResult } = require('express-validator');
const { csrfProtection, asyncHandler } = require('./utils');
const { requireAuth } = require('../auth.js')
const router = express.Router();
const { Answer } = require('../db/models');

const checkAnswerFields = [
  check('content')
    .exists({ checkFalsy: true })
    .withMessage('You forgot to type your answer!')
    .isLength({ max: 1000 })
    .withMessage('Your answer is too damn long!'),
  check('streetCred')
    .isLength({ max: 200 })
    .withMessage('Too many credentials!')
];

// GET ANSWER FORM FOR SPECIFIED QUESTION

router.get('/questions/:id(\\d+)/answers', requireAuth, csrfProtection,
  asyncHandler(async function (req, res, next) {
    const questionId = req.params.id;
    res.render('answers-form', { id: questionId, csrfToken: req.csrfToken() })
  })
);

// POST ANSWER

router.post('/questions/:id(\\d+)/answers', requireAuth, checkAnswerFields, csrfProtection,
  asyncHandler(async function (req, res, next) {

    const questionId = req.params.id;
    const userId = req.session.auth.userId;
    const { streetCred, content } = req.body
    const answer = await Answer.build({ streetCred, content, questionId, userId });
    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      await answer.save();
      res.redirect('/questions')
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.render('answers-form', { id: questionId, errors, csrfToken: req.csrfToken() })
    }
  })
);

// GET ANSWER

router.get('/questions/:questionId(\\d+)/answers/:answerId(\\d+)', requireAuth, csrfProtection,
  asyncHandler(async function (req, res, next) {
    const { questionId, answerId } = req.params;
    const userId = req.session.auth.userId;
    const answer = await Answer.findByPk(answerId);
    if (userId === answer.userId) {
      res.render('answer-edit', { questionId, answerId, answer, csrfToken: req.csrfToken() });
    } else {
      const newError = new Error("User did not create this question.")
      newError.status = 403
      next(newError)
    }
  })
);

// EDIT ANSWER

router.post('/questions/:questionId(\\d+)/answers/:answerId(\\d+)', requireAuth, checkAnswerFields, csrfProtection, asyncHandler(async function (req, res, next) {
  const streetCred = req.body.streetCred;
  const content = req.body.content;
  const { questionId, answerId } = req.params;
  const userId = req.session.auth.userId;
  const answer = await Answer.findByPk(answerId);
  const editedAnswer = { streetCred, content, questionId, userId };
  const validatorErrors = validationResult(req);


  if (userId !== answer.userId) {
    const newError = new Error("User did not create this question.")
    newError.status = 403
    next(newError)
  }

  if (validatorErrors.isEmpty()) {
    await answer.update(editedAnswer);
    res.redirect('/questions')
  } else {
    const errors = validatorErrors.array().map((error) => error.msg);
    res.render('answer-edit', { questionId, errors, answerId, answer, csrfToken: req.csrfToken() });
  }
})
);

// DELETE ANSWER

router.post('/questions/:questionId(\\d+)/answers/:answerId(\\d+)/delete', requireAuth, csrfProtection, asyncHandler(async function (req, res, next) {
  const { questionId, answerId } = req.params;
  const answer = await Answer.findByPk(answerId);
  const userId = req.session.auth.userId;
  if (userId !== answer.userId) {
    const newError = new Error("User did not create this question.")
    newError.status = 403
    next(newError)
  }

  if (answer) {
    await answer.destroy()
    res.redirect(`/questions`)
  }

})
);

//FRONT END API ROUTE
router.post('/answers', asyncHandler( async(req, res) => {
  const {content, questionId, userId} = req.body
  const answer = await Answer.build({ content, questionId, userId });
  const newAnswer = await answer.save();
  res.json({message: 'Success', id: newAnswer.id})
}))

router.delete('/answers/delete/:id', asyncHandler( async (req, res) => {
  const answer = await Answer.findByPk(req.params.id)
  await answer.destroy();
  res.json({message: 'Success'});
}))

module.exports = router;
