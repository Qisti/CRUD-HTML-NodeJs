var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var alert = require('alert-node');

var mysql = require('mysql');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require ('connect-flash');
var sess = require('express-session');
var Store = require('express-session').Store;
var BetterMemoryStore = require('session-memory-store')(sess);

const bcrypt2 = require('bcrypt');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
var moment = require('moment');
// const { EventEmitter }  = require('events');

var index = require('./routes/index');
var users = require('./routes/users');
var input = require('./routes/input');
// var edit = require('./routes/edit');

var app = express();

var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '',
  database : 'wonderlabs'
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(session({ secret: 'session secret key' }));
app.use(express.static(path.join(__dirname, 'public')));

var sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


var store = new BetterMemoryStore({ expires: 60 * 60 * 1000, debug: true });
app.use(sess({
  name: 'JSESSION',
  secret: 'MYSECRETISVERYSECRET',
  store:  store,
  resave: true,
  saveUninitialized: true
}));
// app.use('/student', edit);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use('local', new LocalStrategy({
  username: 'username',
  password: 'password',

  passReqToCallback: true} , 
  function (req, username, password, done){
    if(!username || !password ) { return done(null, false, req.flash('message','All fields are required.')); }
    var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';

    connection.query("select * from users where username = ?", [username], function(err, rows){
      console.log(err); console.log(rows);
      if (err) return done(req.flash('message',err));
      if(!rows.length){ return done(null, false, req.flash('message','Invalid username or password.')); }
      salt = salt+''+password;
      var encPassword = crypto.createHash('sha1').update(salt).digest('hex');
      var dbPassword  = rows[0].password;

      if(!(dbPassword == encPassword)){
        return done(null, false, req.flash('message','Invalid username or password.'));
      }
      return done(null, rows[0]);
    });
  }
  ));

passport.serializeUser(function(username, done){
  done(null, username.id_user);
});

passport.deserializeUser(function(id_user, done){
  connection.query("select * from users where id_user = ? ", [id_user], function (err, user){
    if (err) return done(err);  
    done(null, user);
  });
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/students',
  failureRedirect: '/login',
  failureFlash: true
}), function(req, res, info){
  res.render('index',{'message' :req.flash('message')});
  //res.redirect('/students');
});

app.get('/forgot', function(req, res) {
  res.render('forgot');
});

app.post('/setPassword', function(req, res, next) {
  var email = req.body.email;
  console.log(email);
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      var email = req.body.email;
      connection.query('SELECT * FROM users WHERE email = ?', email, function(err, rows) {
        if(err) throw err;
        console.log(rows.length);
        if(rows.length <= 0) {
          alert('Email not registered !');
          // req.flash('error', 'No account with that email address exists.');
        }
        console.log(token);

        var swd_token = token;
        var ate_reset = moment().toDate();
        var resetPswd = {
          pswd_token: swd_token, date_reset: ate_reset
        }

        console.log(resetPswd);

        connection.query('update users set ? where email = "'+email+'"', [resetPswd], function(err, rows) {
          if(err) throw err;
          console.log("token di set token :", swd_token);
          console.log(rows);
          done(err, token, rows);
          alert("Check your email to reset password !");
        });
      });  
    },
    function(token, rows, done) {
      var mailOptions = {
        to: email,
        from: 'passwordreset@demo.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + req.headers.host + '/reset/' + token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      console.log("proses kirim");
      sgMail.send(mailOptions, function(err) {
        // req.flash('info', 'An e-mail has been sent to ' + req.body.mail + ' with further instructions.');
        done(err, 'done');
      });
    }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/forgot');
    });
});

app.get('/reset/:token', function(req, res){

  connection.query('SELECT * FROM users WHERE pswd_token = ? ', [req.params.token], function(err, rows, fields) {
    if(err) throw err;
    console.log("token 2", req.params.token);
    console.log("length nya rows :", rows);
    if(rows.length <= 0) {
      alert("Token is invalid !");
      console.log("token belumbisa masuk");
    }

    var username = rows[0].username;
    res.render('reset', {susername: username});
    // res.render('reset');
    console.log(username);
  });
});

app.post('/reset/:token', function(req, res) {
  var username = req.body.username;
  console.log(username);
  async.waterfall ([
    function(done) {
      connection.query('SELECT * from users where pswd_token = "'+req.params.token+'"', function(err, rows) {
        if(rows.length <=0){
          alert("Email not registered !");
          console.log("email belum terdaftar")
        }
        console.log("hasil select 2", rows);
        
        var swd_token = undefined;
        var ate_reset = undefined;
        var spassword = req.body.password;
        var spassword2 = req.body.password2;
        var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
        spassword = salt+''+spassword;
        console.log(rows[0].email);
        var email = rows[0].email;

        var reset = {pswd_token: swd_token, date_reset: ate_reset}
        connection.query('UPDATE users SET password = sha1("'+spassword+'"), ? WHERE email = "'+email+'"', [reset], function(err, rows) {
          if(err) throw err;
          console.log("berhasil set password baru")
          console.log("rows", rows);
          // var email = rows[0].email;
          // console.log("email ke 2", email);
          // done(err, rows);
        });
        // console.log("email ke 2:", email);
        console.log(username);
        connection.query('select * from users where username = ?', [username], function(err, rows) {
          done(err, rows);
        });
      });
    },
    function(rows, done) {
      console.log("yang ke 3 :", rows)
      var optnMsg = {
        to: rows[0].email,
        from: 'passwordreset@demo.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
        'This is a confirmation that the password for your account ' + rows[0].email + ' has just been changed.\n'
      };
      sgMail.send(optnMsg, function(err) {
        console.log("email sudah dikirim");
        done(err, 'done');
      });
    }
    ], function(err) {
     if (err) return next(err);
      // res.render('/');
      res.redirect('/');
    })
})

app.get('/login', function(req, res){
  // res.render('index', {'message': req.flash('message')});
  res.redirect('/')
});

app.get('/',function(req,res){
  res.render('login', {'message' :req.flash('message')});
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } 
  res.redirect('/login');
}


app.use('/input', isAuthenticated, input);
app.use('/', isAuthenticated, index);

// app.use('/students', index);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
