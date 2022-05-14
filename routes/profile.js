const express = require('express');
const { check, validationResult } = require('express-validator');
const { csrfProtection, asyncHandler } = require('./utils');
const { requireAuth } = require('../auth.js')
const router = express.Router();
const { User, Answer, Question, Comment, Tag } = require('../db/models');

router.get('/users/:userId(\\d+)', requireAuth, asyncHandler(async function (req, res, next) {
    const loggedInUserId = req.session.auth.userId
    const loggedInUser = await User.findByPk(loggedInUserId)
    const { userId } = req.params;

    const questions = await Question.findAll({include: [{model: Answer, include: [{model: Comment, include:[User]}, User]},{model: Tag},{model: User}]});
    const user = await User.findByPk(userId, {include: [{model: Question, include: [{model: Answer, include: [{model: Comment, include: {model:User}},{model: User}]}]}]});
    for (let i = 0; i < user.Questions.length; i++) {
        const question = user.Questions[i];

        for (let i = 0; i < question.Answers.length; i++) {
            const answer = question.Answers[i];
            console.log(answer.Comments.User)
            console.log('ASNSWER')
            console.log('ASNSWER')
            console.log('ASNSWER')
            console.log('ASNSWER')
            console.log('ASNSWER')
            console.log('ASNSWER')
            console.log('ASNSWER')
            console.log('ASNSWER')
            console.log('ASNSWER')
            console.log('ASNSWER')
            console.log('ASNSWER')
            console.log('ASNSWER')
            console.log('ASNSWER')
            console.log('ASNSWER')
            console.log('ASNSWER')
            console.log('ASNSWER')
            console.log('ASNSWER')
            console.log('ASNSWER')
            // for (let i = 0; i < answer.Comments.length; i++) {
            //     const element = answer.Comments[i];

            // }
        }

    }
    // user.Questions.forEach(question => question.Answers.forEach(answer => console.log(answer.User.id)))
    // const questions = await Question.findAll({include: [{model: Answer, include: [Comment, User]},{model: Tag},{model: User}]});
    // console.log(user.fullName)
    // console.log(user.Questions)
    // console.log(user.Questions[0].Answers)
    res.render('user-detail', { user, questions, loggedInUser })
    })
)

module.exports = router;
