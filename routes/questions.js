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
    .withMessage('Please provide a question title')
    .isLength({ max: 100 })
    .withMessage('Question title must not be more than 100 characters'),
  check('content')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Content')
    .isLength({ max: 500 })
    .withMessage('Question body must not be more than 500 characters'),
  check('media')
    .isString(),
  check('tagId')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a tag')
];
router.get('/get-answers/:id', async(req, res) => {
  let questionId = req.params.id;
  let question = await db.Question.findByPk(questionId, {
    include: [
      db.Answer
    ]
  })
  // console.log(question)
  res.send(question)
})

router.get('/questions', csrfProtection, asyncHandler(async(req, res) => {
  const tags = await db.Tag.findAll();
  const questions = await db.Question.findAll({include: [{model: db.Answer, include: [{model: db.Comment, include:[db.User]}, db.User]},{model: db.Tag},{model: db.User}]});
  questions.forEach(question => question.Answers.forEach(answer => answer.Comments.forEach(comment => console.log(comment))))
  if(req.session.auth){
  const loggedInUserId = req.session.auth.userId
  const loggedInUser = await db.User.findByPk(loggedInUserId)
  res.render('questions', {
    title: 'All Questions',
    tags,
    questions,
    csrfToken: req.csrfToken(),
    loggedInUser,
   });
  }else{
    res.render('questions', {
      title: 'Questions',
      tags,
      questions,
      csrfToken: req.csrfToken(),

     });
  }


}));

router.get('/questions/tag/:id', csrfProtection, asyncHandler(async(req, res, next) => {
  const tagId = req.params.id
  const tags = await db.Tag.findAll();
  const questions = await db.Question.findAll({where: {tagId},include: [{model: db.Answer, include: [{model: db.Comment, include:[db.User]}, db.User]},{model: db.Tag},{model: db.User}]});
  questions.forEach(question => question.Answers.forEach(answer => answer.Comments.forEach(comment => console.log(comment))))
  const tag = await db.Tag.findByPk(tagId)
 

  if(!tag){
    const newError = new Error("Tag does not exist.");
      newError.status = 404;
      next(newError);
  }
    const tagName = tag.name

    if(req.session.auth){
    const loggedInUserId = req.session.auth.userId
    const loggedInUser = await db.User.findByPk(loggedInUserId)
    res.render('questions', {
      title: `Questions about ${tagName}`,
      tags,
      questions,
      csrfToken: req.csrfToken(),
      loggedInUser,
    });
  }else{
      res.render('questions', {
        title: `Questions about ${tagName}`,
        tags,
        questions,
        csrfToken: req.csrfToken(),
      });
  }


}));


router.get('/questions/add', csrfProtection, requireAuth, asyncHandler(async(req, res) => {
  const question = await db.Question.build();
  const tags = await db.Tag.findAll();
  res.render('question-form', {
    title: 'Questions',
    question,
    tags,
    csrfToken: req.csrfToken(),
   });
}));

router.post('/questions/add', csrfProtection, questionValidators, requireAuth, asyncHandler(async(req, res) => {
  const { title, content, tagId, media } = req.body;
  const userId = req.session.auth.userId
  const question = db.Question.build({
    title,
    content,
    userId,
    tagId,
    media
   });

   const validatorErrors = validationResult(req);

   if (validatorErrors.isEmpty()) {
    await question.save();
    res.redirect('/questions');
  } else {
    const tags = db.Tag.findAll()
    const errors = validatorErrors.array().map((error) => error.msg);
    res.render('question-form', {
      title: 'Submit Question',
      question,
      errors,
      tags,
      csrfToken: req.csrfToken(),
    });
  }

}));


router.get('/questions/:questionId(\\d+)/edit', csrfProtection, requireAuth, asyncHandler(async(req, res, next) => {
    const userId = req.session.auth.userId
    const questionId = parseInt(req.params.questionId, 10);
    const question = await db.Question.findByPk(questionId);
    const tags = await db.Tag.findAll();

    if(userId !== question.userId){
      const newError = new Error("User did not create this question.")
     newError.status = 403
     next(newError)
   }

  res.render('question-edit', {
    title: 'Edit Question',
     question,
     questionId,
     csrfToken: req.csrfToken(),
     tags
  })

}))

router.post('/questions/:questionId(\\d+)/edit', csrfProtection, requireAuth, questionValidators, asyncHandler(async(req, res, next) => {
  const userId = req.session.auth.userId
  const questionId = parseInt(req.params.questionId, 10);
  const question = await db.Question.findByPk(questionId);
  const { title, content, media, tagId} = req.body
  const editObj = {title, content, media, userId : question.userId, tagId}

  const validatorErrors = validationResult(req);
  const errors = validatorErrors.array().map((error) => error.msg);

  if(userId !== question.userId){
     const newError = new Error("User did not create this question.")
    newError.status = 403
    next(newError)
  }else if (!question){
   errors.push("Question does not exist")
  }

  if (validatorErrors.isEmpty()) {
   await question.update(editObj);
   res.redirect("/questions")
 } else {
   const tags = await db.Tag.findAll();
   res.render('question-edit', {
     title: 'Edit Question',
     question,
     questionId,
     errors,
     csrfToken: req.csrfToken(),
     tags
   });
 }
}));

router.post('/questions/:questionId(\\d+)/delete', requireAuth, questionValidators, asyncHandler(async function (req, res, next) {
    const { questionId } = req.params;
    const question = await db.Question.findByPk(questionId);
    const userId = req.session.auth.userId

    if(userId !== question.userId){
      const newError = new Error("User did not create this question.");
      newError.status = 403;
      next(newError);
    }else if (!question){
      const newError = new Error("Question does not exist.");
      newError.status = 404;
      next(newError);
    }else {
      await question.destroy();
      res.redirect('/questions');
   }
  })
);



module.exports = router;
