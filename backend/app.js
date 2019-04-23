const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const createError = require('http-errors');
const indexRouter = require('./routes/api/index');
const contents = require('./routes/api/contents');
const session = require('express-session');
const passport = require('passport');
const users = require('./routes/api/users');
const messages = require('./routes/api/messages');
const app = express();

//Connect to Mongo
const db = require('./config/keys').mongoURI;
mongoose.connect(db,{ useNewUrlParser: true })
  .then(()=>console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use(cors({
  origin: true,
  credentials: true,
}));

//Express session
const sessionMiddleware = session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
});
app.use(sessionMiddleware);

//Bodyparser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport').initialize(passport);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Use Routes
app.use('/users',users);
app.use('/messages',messages);
app.use('/', indexRouter);
app.use('/contents', contents);
app.use('/coverimg', express.static('coverimg'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports.app = app;
module.exports.sessionMiddleware = sessionMiddleware;