const express = require('express');
const cookieParser = require('cookie-parser');
const db = require('./models');
const app = express();
// const userRouter = require('./routes/users.js'); //routes to be updated
// const postRouter = require('./routes/posts.js'); // routes to be updated
app.set('view engine', 'pug')
app.use(express.static('./public'))
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())





const port = 8081;
app.listen(port, () => console.log(`Listening on port ${port}...`));
