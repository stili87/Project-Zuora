const express = require('express');
const cookieParser = require('cookie-parser');
const db = require('./db/models');
const morgan = require('morgan');
const session = require('express-session');
const { sessionSecret, environment } = require('./config');
const routes = require('./routes');
const app = express();
const {restoreUser} = require('./auth.js')

app.use(morgan('dev'));
app.set('view engine', 'pug')
app.use(express.static('./public'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cookieParser(sessionSecret))
app.use(session({
  name:'zuora.sid',
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false
}))

//app.use(restoreUser)   turn on when auth part is added to routes
//////PUT ALL ROUTERS HERE
app.use(routes)



// Catch unhandled requests and forward to error handler.
// Maybe make a custom 404 page-------------------
app.use((req, res, next) => {
    const err = new Error('The requested page couldn\'t be found.');
    err.status = 404;
    next(err);
  });
  
  // Custom error handlers.
  
  // Error handler to log errors.
  app.use((err, req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
      // TODO Log the error to the database.
    } else {
      console.error(err);
    }
    next(err);
  });
  
  // Error handler for 404 errors. NEED CUSTOM PUG PAGE FOR THIS.
  app.use((err, req, res, next) => {
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
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    const isProduction = process.env.NODE_ENV === 'production';
    res.render('error', {
      title: 'Server Error',
      message: isProduction ? null : err.message,
      stack: isProduction ? null : err.stack,
    });
  });

module.exports = app;
