const express = require('express');
const { check, validationResult } = require('express-validator');
const { csrfProtection, asyncHandler } = require('./utils');
const { requireAuth } = require('../auth.js')
const router = express.Router();
const { User, Answer, Question, Comment, Tag } = require('../db/models');

router.get('/users/:userId(\\d+)', asyncHandler(async function (req, res, next) {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {include: [{model: Question, include: [{model: Answer, include: [{model: Comment}]}]}]});
    const questions = await Question.findAll({include: [{model: Answer, include: [Comment, User]},{model: Tag},{model: User}]});
    console.log(user)
    res.render('user-detail', { user, questions })
    })
)

module.exports = router;
