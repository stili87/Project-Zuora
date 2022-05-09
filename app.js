const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const db = require('./db/models');
const morgan = require('morgan');
const { sequelize } = require('./db/models');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { sessionSecret, environment } = require('./config');
const routes = require('./routes');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const answersRouter = require('./routes/answers');
const commentsRouter = require('./routes/comments');
const likesRouter = require('./routes/likes');
const questionsRouter = require('./routes/questions');
const tagsRouter = require('./routes/tags');
const {restoreUser} = require('./auth.js')
const app = express();


app.use(morgan('dev'));
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cookieParser(sessionSecret))
const store = new SequelizeStore({ db: sequelize });
app.use(session({
  name:'zuora.sid',
  secret: sessionSecret,
  store,
  resave: false,
  saveUninitialized: false
}))



store.sync();
//app.use(restoreUser)   turn on when auth part is added to routes
//////PUT ALL ROUTERS HERE
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/answers', answersRouter);
app.use('/comments', commentsRouter);
app.use('/likes', likesRouter);
app.use('/questions', questionsRouter);
app.use('/tags', tagsRouter);



// Catch unhandled requests and forward to error handler.
// Maybe make a custom 404 page-------------------
app.use((req, res, next) => {
    const err = new Error('The requested page couldn\'t be found.');
    err.status = 404;
    next(err);
  });
  
  // Custom error handlers.
    
  // Error handler for 404 errors. NEED CUSTOM PUG PAGE FOR THIS.
  app.use((err, req, res, next) => {
    console.error(err);
    if (err.status === 404) {
      res.status(404);
      res.render('page-not-found', {
        title: 'Page Not Found',
      });
    } else {
      next(err);
    }
  });
  
  // Generic error handler.   NEED CUSTOM PUG PAGE FOR THIS.
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

module.exports = app;
