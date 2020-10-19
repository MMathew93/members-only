require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const User = require('./models/user');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const memberRouter = require('./routes/membership');
const messageRouter = require('./routes/message');

const app = express();

let mongoose = require('mongoose');
let mongoDB = process.env.SECRET;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ user_name: username }, (err, user)=> {
      if(err) {
        return done(err);
      };
      if(!user) {
        return done(null, false, {message: 'Incorrect username' });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if(res) {
          return done(null, user)
        }else {
          return done(null, false, { message: "Incorrect password" })
        }
      });
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(_id, done) {
  User.findById(_id, function(err, user) {
    done(err, user);
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'cats', resave: true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/member', memberRouter);
app.use('/message', messageRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
