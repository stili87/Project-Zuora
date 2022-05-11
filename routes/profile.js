const express = require('express');
const { check, validationResult } = require('express-validator');
const { csrfProtection, asyncHandler } = require('./utils');
const { requireAuth } = require('../auth.js')
const router = express.Router();
const { User, Answer, Question, Comment } = require('../db/models');

router.get('/users/:userId', asyncHandler(async function (req, res, next) {
    const { userId } = req.params;
    // const user = await User.findByPk(userId, {include: [{model: Question, {include: {model: Answer, {include: Comment}}}, Comment, Answer]})
    const user = await User.findByPk(userId, {include: [{model: Question, include: [{model: Answer, include: [{model: Comment}]}]}]});
    let answersArr = []
    for (let i = 0; i < user.Questions.length; i++) {
        answersArr.push(user.Questions[i].Answers)
    }

    console.log(answersArr[0].Comments)

    res.render('user-detail', { user })
    })
)

module.exports = router;
