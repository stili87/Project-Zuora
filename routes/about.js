const express = require('express');
const router = express.Router();
const { requireAuth } = require('../auth')
const { csrfProtection, asyncHandler } = require('./utils');
const { check, validationResult } = require('express-validator');
const db = require('../db/models');


router.get('/about',csrfProtection, asyncHandler( async (req, res, next) =>  {
  res.render('about', {title: 'About Zuora', csrfToken: req.csrfToken()} )
}));

module.exports = router;
