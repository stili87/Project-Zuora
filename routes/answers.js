const express = require('express');
const { check, validationResult } = require('express-validator');
const { csrfProtection, asyncHandler } = require('./utils');
const { requireAuth } = require('../auth.js')
const router = express.Router();
const { Question, Answer, Comment } = require('../db/models');

/* GET answers form for specific question. */
router.get('/questions/:id/answers', requireAuth, csrfProtection, asyncHandler(
  async function (req, res, next) {
    const thisQuestionId = req.params.id;
    const thisQuestion = Question.findByPk(thisQuestionId);
    // const answer = Answer.build();
    res.render('answers-form', {id : thisQuestionId})
  }
));

module.exports = router;
