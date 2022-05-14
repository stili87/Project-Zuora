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
    .isLength({ max: 500 })
    .withMessage('Comment is too long; please shorten'),
];



router.get('/answer/:id(\\d+)/comments', requireAuth, csrfProtection, asyncHandler(async (req, res, next) => {
  const id = req.params.id
  const comment = await db.Comment.build()
  res.render('comment-form', { comment, title: 'Create New Comment', csrfToken: req.csrfToken(), id })
}));

router.post('/answer/:id(\\d+)/comments', requireAuth, csrfProtection, commentValidators, asyncHandler(async (req, res, next) => {
  const { content } = req.body
  const answerId = req.params.id
  const userId = req.session.auth.userId
  const comment = await db.Comment.build({
    content,
    answerId,
    userId,
  });
  const validatorErrors = validationResult(req);
  if (validatorErrors.isEmpty()) {
    await comment.save();
    res.redirect('/questions');
  } else {
    const errors = validatorErrors.array().map((error) => error.msg);
    res.render('comment-form', {
      title: 'Create New Comment',
      csrfToken: req.csrfToken(),
      errors,
      comment
    });
  }
}));

///this works delteing comment
router.post('/answer/:id(\\d+)/comments/delete/:id(\\d+)', requireAuth, asyncHandler(async (req, res, next) => {
  const commentId = req.params.id
  const userId = req.session.auth.userId
  const deleteComment = await db.Comment.findByPk(commentId)
  if (deleteComment && deleteComment.userId === userId) {
    deleteComment.destroy()
    res.redirect("/questions")
  } else {   //Redirects if the author of the comment does not match the current logged in user
    res.redirect("/questions")
  }
}))

router.get('/answer/:id(\\d+)/comments/edit/:id(\\d+)', requireAuth, csrfProtection, asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const userId = req.session.auth.userId;
  const editComment = await db.Comment.findByPk(id);

  if (userId !== editComment.userId) {
    const newError = new Error("User did not create this comment.")
    newError.status = 403
    next(newError)
  }

  if (editComment) {
    res.render('edit-comment', {
      id,
      title: "Edit your comment",
      editComment,
      csrfToken: req.csrfToken()
    })
  } else {
    res.redirect("/questions")
  }
}))

router.post('/answer/:id(\\d+)/comments/edit/:id(\\d+)', requireAuth, commentValidators, csrfProtection, asyncHandler(async (req, res, next) => {
  const commentId = req.params.id;
  const userId = req.session.auth.userId;
  const editComment = await db.Comment.findByPk(commentId);
  const { content } = req.body;
  const updateComment = {
    content,
    userId: editComment.userId,
    answerId: editComment.answerId
  }

  if (userId !== editComment.userId) {
    const newError = new Error("User did not create this comment.")
    newError.status = 403
    next(newError)
  }

  const validatorErrors = validationResult(req);

  if (validatorErrors.isEmpty() && editComment) {
    await editComment.update(updateComment)
    res.redirect("/questions")
  } else {
    const errors = validatorErrors.array().map((error) => error.msg);
    res.render('edit-comment', {
      id: commentId,
      title: "Edit your comment",
      editComment,
      csrfToken: req.csrfToken(),
      errors
    })
  }
}))

// edit comment
router.patch('/comments/edit/:id', requireAuth, asyncHandler(async (req, res) => {
  const { content } = req.body;
  const comment = await db.Comment.findByPk(req.params.id);
  await comment.update({ content });
  res.json({ message: 'Success' });
}))

// delete comment
router.delete('/comments/delete/:id', requireAuth, asyncHandler(async (req, res) => {
  const comment = await db.Comment.findByPk(req.params.id);
  await comment.destroy();
  res.json({ message: 'Success' });
}))

router.post('/comments/add', requireAuth, asyncHandler(async (req, res) => {
  const {content, answerId, userId} = req.body
  const comment = await db.Comment.create({
    content,
    answerId,
    userId,
  });
  res.json(comment);
}))

module.exports = router;
