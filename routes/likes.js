const express = require('express');
const router = express.Router();

/* GET users listing. */
router.post('/:questionId(\\d+)/like/add',
  asyncHandler(async (req, res) => {
    const questionId = parseInt(req.params.questionId, 10);
    const question = await db.Question.findByPk(questionId);

    const {
      title,
      content,
      tagId,
      userId,
      media
    } = req.body;

    const like = db.Like.build({
      userId,
      questionId,
      answerId
    });

    await like.save();
    res.redirect(`/question/${questionId}`);
  }));


router.post('/like/delete/:id(\\d+)',
  asyncHandler(async (req, res) => {
    const likeId = parseInt(req.params.id, 10);
    const like = await db.Like.findByPk(likeId);
    await like.destroy();
  }));


router.post('/:answerId(\\d+)/like/add',
  asyncHandler(async (req, res) => {
    const answerId = parseInt(req.params.answerId, 10);
    const answer = await db.Answer.findByPk(answerId);

    const {
      questionId,
      userId,
      streetCred,
      content
    } = req.body;

    const like = db.Like.build({
      userId,
      questionId,
      answerId
    });

    await like.save();
    res.redirect(`/answer/${answerId}`);
  }));

module.exports = router;
