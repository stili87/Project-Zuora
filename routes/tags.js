const express = require('express');
const { check, validationResult } = require('express-validator');
const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils');
const router = express.Router();
const { requireAuth } = require('../auth');

const tagValidators = [
  check('name')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a tag')
    .custom((value) => {
      return db.Tag.findOne({ where: { name: value } })
        .then((tag) => {
          if (tag) {
            return Promise.reject('The provided Tag is already in existance');
          }
        });
    })
];

router.get('/tags',csrfProtection, requireAuth,  asyncHandler( async (req, res, next) =>  {
  res.render('create-tags', {title: 'Create a Tag', csrfToken: req.csrfToken()} )
}));

router.post('/tags', csrfProtection, requireAuth, tagValidators, asyncHandler( async (req, res, next) =>  {
  const {name} = req.body
  const newTag = await db.Tag.build({
    name
  })

  const validatorErrors = validationResult(req);
        if (validatorErrors.isEmpty()) {
          await newTag.save();
          res.redirect('/');
      } else {
        const errors = validatorErrors.array().map((error) => error.msg);
        res.render('create-tags', {
            title: 'Create New Tag',
            csrfToken: req.csrfToken(),
            errors
          });
      }

}));

module.exports = router;
