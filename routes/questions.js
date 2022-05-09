const express = require('express');
const router = express.Router();


const db = require('../db/models')

router.get('/', function(req, res, next) {
  const questions = db.Question.findAll();
  console.log(questions)
  res.send('questions', {
    title: 'Questions',
    questions
   });
});

module.exports = router;
