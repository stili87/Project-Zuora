const express = require('express');
const router = express.Router();
const { requireAuth } = require('../auth');
const { csrfProtection, asyncHandler } = require('./utils');
const db = require('../db/models');

router.post('/likes/:questionId(\\d+)/like/add', requireAuth,
  asyncHandler(async (req, res) => {
    const questionId = parseInt(req.params.questionId, 10);
    const userId = req.session.auth.userId

    const like = db.Like.build({
      userId,
      questionId,
    });

    await like.save();
  }));


router.post('/likes/delete/:id(\\d+)', requireAuth,
  asyncHandler(async (req, res) => {
    const likeId = parseInt(req.params.id, 10);
    const like = await db.Like.findByPk(likeId);
    await like.destroy();
  }));

  router.post('/likes/questions/:questionId(\\d+)/add', requireAuth,
   asyncHandler(async (req, res) => {
    const questionId = parseInt(req.params.asnwerId, 10);
    const userId = req.session.auth.userId

    const like = db.Like.build({
      userId,
      questionId,
    });

    await like.save();
  }));

router.post('/likes/answers/:answerId(\\d+)/add', requireAuth,
   asyncHandler(async (req, res) => {
    const answerId = parseInt(req.params.asnwerId, 10);
    const userId = req.session.auth.userId

    const like = db.Like.build({
      userId,
      answerId,
    });

    await like.save();
  }));

module.exports = router;
