var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mysql = require('mysql');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require ('connect-flash');
var crypto = require ('crypto');
var sess = require('express-session');
var Store = require('express-session').Store;
var BetterMemoryStore = require('session-memory-store')(sess);


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
app.use(express.static(path.join(__dirname, 'public')));


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

// app.get('/login', function(req, res, next) {
//   passport.authenticate('local', function(err, user, info) {
//     if (err) { return next(err); }
//     if (!username) { return res.redirect('/login'); }
//     req.logIn(username, function(err) {
//       if (err) { return next(err); }
//       return res.redirect('/students');
//     });
//   })(req, res, next);
// });



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
// console.log(isAuthenticated());

app.use('/input', isAuthenticated, input);
app.use('/', isAuthenticated, index);

app.get('/logout', function (req, res) {
  if(!req.isAuthenticated()) {
     notFound404(req, res, next);
  } else {
     req.logout();
     res.redirect('/login');
  }
})

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
