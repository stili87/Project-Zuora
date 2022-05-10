const express = require('express');
const { check, validationResult } = require('express-validator');
const { csrfProtection, asyncHandler } = require('./utils');
const { requireAuth } = require('../auth.js')
const router = express.Router();
const { Question, Answer, Comment } = require('../db/models');

const checkAnswerFields = [
  check('content')
    .exists({ checkFalsy: true })
    .withMessage('You forgot to type your answer!')
    .isLength({ max: 1000 })
    .withMessage('Your answer is too damn long!'),
  check('streetCred')
    .isLength({ max: 200 })
    .withMessage('Too many credentials!')
]

/* GET answers form for specific question. */
router.get('/questions/:id/answers', requireAuth, csrfProtection,
  asyncHandler(async function (req, res, next) {
    const questionId = req.params.id;
    // const thisQuestion = await Question.findByPk(questionId);
    // const answer = Answer.build();
    res.render('answers-form', { id: questionId, csrfToken: req.csrfToken() })
  }
));

router.post('/questions/:id/answers', requireAuth, checkAnswerFields, csrfProtection,
  asyncHandler(async function (req, res, next) {
    const streetCred = req.body.streetCred;
    const content = req.body.content;
    const questionId = req.params.id;
    const userId = req.session.auth.userId;

    const answer = await Answer.build({ streetCred, content, questionId, userId });
    const validatorErrors = validationResult(req);
    if (validatorErrors.isEmpty()) {
      await answer.save();
      res.redirect('/')
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.render('answers-form', { id: questionId, errors, csrfToken: req.csrfToken() })
    }
  }
))

router.get('/questions/:questionId/answers/:answerId', requireAuth, checkAnswerFields, csrfProtection,
  asyncHandler(async function (req, res, next) {
    const { questionId, answerId } = req.params;
    const userId = req.session.auth.userId;
    let answer = await Answer.findByPk(answerId);
    if (userId === answer.userId) {
      res.render('answer-edit', { questionId, answerId, answer, csrfToken: req.csrfToken() })
    } else {
      res.redirect('/')
    }
  }
))

router.post('/questions/:questionId/answers/:answerId', requireAuth, checkAnswerFields, csrfProtection,
  asyncHandler(async function (req, res, next) {

  })
);

module.exports = router;
