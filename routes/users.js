const express = require('express');
const { check, validationResult } = require('express-validator');
const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils');
const bcrypt = require('bcryptjs')
const router = express.Router();
const { loginUser, logoutUser, requireAuth } = require('../auth');

const loginValidators = [
  check('email')
    .exists({ checkFalsy: true })
    .withMessage('Please provide an Email Address'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a Password')
];

router.get('/users/login', csrfProtection, (req, res) => {
  res.redirect('/')
})

router.post('/users/login', csrfProtection, loginValidators, asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const validatorErrors = validationResult(req);
  if (validatorErrors.isEmpty()) {
    const user = await db.User.findOne({ where: { email } })
    if (user) {
      const result = await bcrypt.compare(password, user.hashedPassword.toString())
      if (result) {
        loginUser(req, res, user)
        res.redirect('/questions')
      } else {
        res.render('index', {
          title: 'Login Page',
          csrfToken: req.csrfToken(),
          errors: ["Email or Password did not match records."]
        });
      }
    }else {
      res.render('index', {
        title: 'Login Page',
        csrfToken: req.csrfToken(),
        errors: ["Email or Password did not match records."]
    })
  } 
  }else {
    const errors = validatorErrors.array().map((error) => error.msg);
    res.render('index', {
      title: 'Login Page',
      csrfToken: req.csrfToken(),
      errors
    });
}}))

router.post('/users/logout', async (req, res) => {
  logoutUser(req, res)
  res.redirect('/')
})




const userValidators = [
  check('fullName')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for First Name')
    .isLength({ max: 100 })
    .withMessage('First Name must not be more than 100 characters long'),
  check('email')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Email Address')
    .isLength({ max: 50 })
    .withMessage('Email Address must not be more than 50 characters long')
    .isEmail()
    .withMessage('Email Address is not a valid email')
    .custom((value) => {
      return db.User.findOne({ where: { email: value } })
        .then((user) => {
          if (user) {
            return Promise.reject('The provided Email Address is already in use by another account');
          }
        });
    }),
  check('bio')
    .isLength({ max: 300 })
    .withMessage('Bio must not be more than 300 characters long'),
  check('credentials')
    .isLength({ max: 100 })
    .withMessage('Credentials must not be more than 100 characters long'),
  check('picSrc')
    .isLength({ max: 300 })
    .withMessage('Picture Source must not be more than 300 characters long'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Password')
    .isLength({ max: 50 })
    .withMessage('Password must not be more than 50 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, 'g')
    .withMessage('Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")'),
  check('confirmPassword')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Confirm Password')
    .isLength({ max: 50 })
    .withMessage('Confirm Password must not be more than 50 characters long')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Confirm Password does not match Password');
      }
      return true;
    })
];


router.get('/users/register', csrfProtection, (req, res) => {
  const user = db.User.build();
  res.render('user-register', {
    title: 'Register',
    user,
    csrfToken: req.csrfToken(),
  });
});

router.post('/users/register', csrfProtection, userValidators,
  asyncHandler(async (req, res) => {
    const {
      email,
      password,
      fullName,
      bio,
      credentials,
      picSrc
    } = req.body;

    const user = db.User.build({
      email,
      fullName,
      bio,
      credentials,
      picSrc
    });

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.hashedPassword = hashedPassword;
      await user.save();
      loginUser(req, res, user);
      res.redirect('/questions');
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.render('user-register', {
        title: 'Register',
        user,
        errors,
        csrfToken: req.csrfToken(),
      });
    }
  }));


const userEditValidators = [
  check('fullName')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for First Name')
    .isLength({ max: 100 })
    .withMessage('First Name must not be more than 100 characters long'),
  check('email')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Email Address')
    .isLength({ max: 50 })
    .withMessage('Email Address must not be more than 50 characters long')
    .isEmail()
    .withMessage('Email Address is not a valid email'),
  check('bio')
    .isLength({ max: 300 })
    .withMessage('Bio must not be more than 300 characters long'),
  check('credentials')
    .isLength({ max: 100 })
    .withMessage('Bio must not be more than 100 characters long'),
  check('picSrc')
    .isLength({ max: 300 })
    .withMessage('Bio must not be more than 300 characters long'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Password')
    .isLength({ max: 50 })
    .withMessage('Password must not be more than 50 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, 'g')
    .withMessage('Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")'),
  check('confirmPassword')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Confirm Password')
    .isLength({ max: 50 })
    .withMessage('Confirm Password must not be more than 50 characters long')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Confirm Password does not match Password');
      }
      return true;
    })
];


router.get('/users/edit/:id(\\d+)', requireAuth, csrfProtection, asyncHandler(async (req, res, next) => {
  const userId = parseInt(req.params.id, 10);
  const authUserId = req.session.auth.userId;
  const user = await db.User.findByPk(userId);

  if (userId !== authUserId) {
    const newError = new Error("User cannot modify other users.")
    newError.status = 403
    next(newError)
  }

  res.render('user-edit', {
    title: 'Edit User',
    user,
    csrfToken: req.csrfToken(),
  });
}));




router.post('/users/edit/:id(\\d+)', requireAuth, csrfProtection, userEditValidators,

  asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const userCompareId = req.session.auth.userId
    const userToUpdate = await db.User.findByPk(userId);

    if (userId !== userCompareId) {
      const newError = new Error("User cannot modify other users.")
      newError.status = 403
      next(newError)
    }

    const {
      email,
      password,
      fullName,
      bio,
      credentials,
      picSrc
    } = req.body;

    const user = {
      email,
      password,
      fullName,
      bio,
      credentials,
      picSrc
    };

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      await userToUpdate.update(user);
      res.redirect(`/users/${userId}`);
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.render('user-edit', {
        title: 'Edit User',
        user: { ...user, id: userId },
        errors,
        csrfToken: req.csrfToken(),
      });
    }
  }));
  
//Bad code incorrectly using patch to retrieve information.  It is necessary for the site to work
//but breaks convetion. 
router.patch('/users', asyncHandler( async(req, res)=> {
  const {id} = req.body
  const user = await db.User.findByPk(id)
  res.json(user)
}))


////////DISABLING THIS BECAUSE IT DOES NOT WORK
// router.get('/users/delete/:id(\\d+)', requireAuth, csrfProtection, asyncHandler(async (req, res, next) => {
//     const userId = parseInt(req.params.id, 10);
//     const user = await db.User.findByPk(userId);
//     const userCompareId = req.session.auth.userId



//     if(userId !== userCompareId){
//       const newError = new Error("User cannot modify other users.")
//        newError.status = 403
//        next(newError)
//       }

//     res.render('user-delete', {
//       title: 'Delete User',
//       user,
//       csrfToken: req.csrfToken(),
//     });
//   }));
///////////DOES NOT WORK AND WHEN TRY TO FIX, BREAKS OTHER THINGS, DO NOT USE
// router.post('/users/delete/:id(\\d+)', requireAuth, csrfProtection,  asyncHandler(async (req, res, next) => {
//     const userId = parseInt(req.params.id, 10);
//     const user = await db.User.findByPk(userId);
//     const userCompareId = req.session.auth.userId

//     if(userId !== userCompareId){
//       const newError = new Error("User cannot modify other users.")
//        newError.status = 403
//        next(newError)
//       }


//     await user.destroy();
//     res.redirect('/users/register');
//   }));





  // router.get('/users/:userId', requireAuth, csrfProtection,
  //   asyncHandler(async function (req, res) {
  //     const { userId } = req.params;
  //     const user = await db.User.findByPk(userId, {include: ['Question', 'comments', 'answers']})
  //     res.render('user-detail', { csrfToken: req.csrfToken(), user })
  //   })
  // );


module.exports = router;
