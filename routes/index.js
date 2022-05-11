const express = require('express');
const { csrfProtection, asyncHandler } = require('./utils');
const router = express.Router();

router.get('/', csrfProtection, (req, res) => {
        res.render('index', { title: 'Project Zuora', csrfToken: req.csrfToken() });
});

module.exports = router;
