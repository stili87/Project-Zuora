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
    .isLength({max: 500})
    .withMessage('Comment is too long; please shorten'),
];



router.get('/answer/:id(\\d+)/comments', requireAuth, csrfProtection,  asyncHandler( async (req, res, next) => {
  const id = req.params.id
  
  res.render('comment-form', {title: 'Create New Comment', csrfToken: req.csrfToken(), id })
}));

router.post('/answer/:id(\\d+)/comments', requireAuth, csrfProtection, asyncHandler( async (req, res, next) => {
  const {content} = req.body
  const answerId = req.params.id
  const userId = req.session.auth.userId
  const comment = await db.Comment.build({
        content,
        answerId,
        userId
    });
    const validatorErrors = validationResult(req);
        if (validatorErrors.isEmpty()) {
          await comment.save();
          res.redirect('/');
      } else {
        const errors = validatorErrors.array().map((error) => error.msg);
        res.render('comment-form', {
            title: 'Create New Comment',
            csrfToken: req.csrfToken(),
            errors
          });
      }
}));
///This is only for testing.
router.get('/comments/delete/:id(\\d+)',requireAuth, asyncHandler( async(req, res, next) =>{
  const id = req.params.id
  const userId = req.session.auth.userId
  const deleteComment = await db.Comment.findByPk(commentId)
  if(deleteComment && deleteComment.userId === userId){
      res.render('delete-comment', {id})
    }else {
      res.redirect("/")
    }
} ))

///this works
router.post('/comments/delete/:id(\\d+)', requireAuth, asyncHandler( async (req, res, next) =>{
  const commentId = req.params.id
  const userId = req.session.auth.userId
  const deleteComment = await db.Comment.findByPk(commentId)
    if(deleteComment && deleteComment.userId === userId){
      deleteComment.destroy()
    }else{   //Redirects if the author of the comment does not match the current logged in user
      res.redirect("/")
    }
}))

router.get('/comments/edit/:id(\\d+)', requireAuth, csrfProtection, asyncHandler( async (req, res, next)=> {
  const id = req.params.id;
  const userId = req.session.auth.userId;
  const editComment = await db.Comment.findByPk(id);

  if(editComment && editComment.userId === userId){
      res.render('edit-comment', {
        id,
        title: "Edit your comment",
        editComment,
        csrfToken: req.csrfToken()
      })
  }else{
    res.redirect("/")
  }
}))

router.post('/comments/edit/:id(\\d+)', requireAuth, commentValidators, csrfProtection, asyncHandler( async (req, res, next) =>{
  const commentId = req.params.id;
  const userId = req.session.auth.userId;
  const editComment = await db.Comment.findByPk(commentId);
  const {content} = req.body;
  const updateComment = {
    content, 
    userId: editComment.userId,
    answerId: editComment.answerId
  }
  console.log(updateComment)
  const validatorErrors = validationResult(req);
  
  if (validatorErrors.isEmpty()) {
    if(editComment && editComment.userId === userId){
      await editComment.update(updateComment)
      res.redirect("/")
    }else{   
      const errors = ["You are not the owner of this comment."]
      res.render('edit-comment', {
        id,
        title: "Edit your comment",
        editComment,
        csrfToken: req.csrfToken(),
        errors 
      })
    }
  }else {
    res.render('edit-comment', {
      id,
      title: "Edit your comment",
      editComment,
      csrfToken: req.csrfToken(),
      errors: validatorErrors
    })
  }
}))


module.exports = router;
