var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var alert = require('alert-node');
var util = require('./');

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}

router.get('/input', function(req, res) {
  res.render('input');
});

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

function formatDate(date) {
  var d = new Date(date),
  month = '' + (d.getMonth() + 1),
  day = '' + d.getDate(),
  year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [day, month, year].join('-');
}

function getStudentGender(studentGender){
  if(studentGender === 'f'){
    gender = 'Female';
  } else {
    gender = 'Male';
  }
  return gender;
};

router.get('/adminList', function(req, res) {
  var adminList = [];
  
  connection.query('SELECT * FROM users', function(err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(500).json({"status_code": 500,"status_message": "internal server error"});
    } else {
      console.log(rows);

      for (var i = 0; i < rows.length; i++) {
        var admin = {
          'id_user': rows[i].id_user,
          'username':rows[i].username,
          'email': rows[i].email
        }

        adminList.push(admin);
      }

      res.render('adminList', {title: 'Admin List', data: adminList});
    }
  });

})

router.get('/addUser', function(req, res) {
  res.render('inputUser');
})

router.post('/addUser', function(req, res) {
  
  var username = req.body.username;
  var email = req.body.email;
  var password2= req.body.password2;
  var password = req.body.password;

  console.log(username, password2)

  if (password === password2) {
    console.log("benar");
    connection.query('SELECT email FROM users WHERE email = ?', email, function(err, rows) {
      if(err) throw err;
      if(rows.length>0) {
        alert('Email already in use !');
      }
      connection.query('SELECT username FROM users WHERE username = ?', username, function(err, rows) {
        if(rows.length>0) {
          alert("Username already in use !")
        } else {
            // var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
            // password = salt+''+password;
            // var spassword = mysql.format('sha1('+password+')');
            // var insert = {
            //   username: username,
            //   password: spassword, 
            //   email: email
            // }

            connection.query('INSERT INTO users (username, password, email) VALUES ("'+username+'", sha1("7fa73b47df808d36c5fe328546ddef8b9011b2c6'+password+'"),"'+email+'")', function(err, res) {
              if (err) throw err;
              console.log("admin berhasil ditambah");
              alert("Succes input admin !");
            });
            res.redirect('/adminList');
          }
        }); 
    });
  } else{
    alert("Password doesn't match !");
  }
  
});

router.post('/delete-admin/:id', function(req, res) {
  connection.query('DELETE from users WHERE id_user = ?', [req.params.id], function(err, rows){
    if(err) throw err;
    res.redirect('/adminList');
  })
})

router.get('/students', function(req, res) {
  var studentList = [];

  connection.query('SELECT * FROM students', function(err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(500).json({"status_code": 500,"status_message": "internal server error"});
    } else {
      console.log(rows);

      // Loop check on each row
      for (var i = 0; i < rows.length; i++) {
        var gender = getStudentGender(rows[i].gender);
        var date_of_birth = formatDate(rows[i].date_of_birth);
        var date_of_entry = formatDate(rows[i].date_of_entry);

        // Create an object to save current row's data
        var student = {
          'id_student':rows[i].id_student,
          'name':rows[i].name,
          'gender': gender,
          'date_of_birth':date_of_birth,
          'address':rows[i].address,
          'mail': rows[i].mail,
          'date_of_entry': date_of_entry
        }
        // Add object into array
        studentList.push(student);
      }

    // Render index.pug page using array 
    res.render('index', {title: 'Student List', data: studentList});
  }
});
});


function formatDateForPug(date) {
  var d = new Date(date),
  month = '' + (d.getMonth() + 1),
  day = '' + d.getDate(),
  year = d.getFullYear();
  
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

router.get('/students/:id', function(req, res){
  connection.query('SELECT * FROM students WHERE id_student = ?', [req.params.id], function(err, rows, fields) {
    if(err) throw err;
    
      // if user not found
      if (rows.length <= 0) {
        res.redirect('/students')
      }
      else { // if user found
        var dateOB = formatDateForPug(rows[0].date_of_birth);
        var dateOE = formatDateForPug(rows[0].date_of_entry);

        res.render('edit', {
          title: 'Edit Student', 
          Id_student: rows[0].id_student,
          Name: rows[0].name,
          Address: rows[0].address,
          Gender: rows[0].gender,
          Date_of_birth: dateOB,
          Mail: rows[0].mail,
          Date_of_entry: dateOE
        });
      }
      
    });
});

router.post('/update', function(req, res) {
  var id_student = req.body.id_student;
  var name= req.body.name;
  var gender= req.body.gender;
  var date_of_birth= req.body.date_of_birth;
  var address= req.body.address;
  var mail= req.body.mail;
  var date_of_entry= req.body.date_of_entry;
  var postData  = {id_student: id_student, name: name, address: address, gender: gender, date_of_birth: date_of_birth, mail: mail, date_of_entry: date_of_entry};
  
  var dateNow = new Date();
  var now = formatDateForPug(dateNow);
  var date = req.body.date_of_birth;
  var entryDate = req.body.date_of_entry;
  
  if (date > now || entryDate > now){
    alert('Invalid input date !');
  } else {
    connection.query('UPDATE students SET id_student = ?, name = ?, gender = ?, date_of_birth = ?, address = ?, mail = ?, date_of_entry = ? WHERE id_student = ?', [id_student, name, gender, date_of_birth, address, id_student, mail, date_of_entry], function(err, rows) {
      if (err) throw err;
    });
    res.redirect('/students');
  }
});

router.post('/delete-student/:id', function(req, res) {
  connection.query('DELETE FROM students WHERE id_student = ?', [req.params.id], function(err, result) {
    if(err) throw err
      res.redirect('/students');
  });
});

router.post('/filter', function(req,res){
  var studentList = [];
  var search = req.body.search;
  var basedOn = req.body.basedOn;
  var order = req.body.order;
  
  var sql = "SELECT * FROM students WHERE "+basedOn+" LIKE '%"+search+"%' ORDER BY "+basedOn+" "+order+"";
  console.log(sql);

  // Do the query to get data.
  connection.query(sql, function(err, rows, fields) {
    if (err) {
      res.status(500).json({"status_code": 500,"status_message": "internal server error"});
    } else {
      console.log(rows);

      // Loop check on each row
      for (var i = 0; i < rows.length; i++) {

        // Create an object to save current row's data
        var student = {
          'id_student':rows[i].id_student,
          'name':rows[i].name,
          'gender':getStudentGender(rows[i].gender),
          'date_of_birth':formatDate(rows[i].date_of_birth),
          'address':rows[i].address,
          'mail':rows[i].mail,
          'date_of_entry':formatDate(rows[i].date_of_entry)
        }
        // Add object into array
        studentList.push(student);
      }

      console.log(rows.length);
      res.render('index', {title: 'Student List', data: studentList});
    }
  });
});

function adapt(original) {
  var copy = [];
  for (var i = 0; i < original.length; ++i) {
    for (var j = 0; j < original[i].length; ++j) {
          // skip undefined values to preserve sparse array
          if (original[i][j] === undefined) continue;
          // create row if it doesn't exist yet
          if (copy[j] === undefined) copy[j] = [];
          // swap the x and y coords for the copy
          copy[j][i] = original[i][j];
        }
      }
      return copy;
    }

// router.get('/statistic', function(req, res) {
//   res.render('statistic');
// })

router.get('/statistic/', function(req, res)  {

  var getMonth = []; getfrek = []; temp_monthfrek=[]; trans_month=[]; getgender = []; getfrekgen = []; temp_genderfrek=[]; trans_gend=[];
  // const chartData = [{'January':0, 'February':0, 'March':0, 'April':0, 'May':0, 'June':0, 'July':0, 'August':0, 'September':0, 'October':0, 'November':0, 'December':0}];


  connection.query('SELECT month(date_of_entry) AS month, count(date_of_entry) AS frekuensi FROM students WHERE year(date_of_entry) = '+[req.query.year]+' GROUP BY month(date_of_entry);', function(err, rows, fields) {
    if (err) {
      console.log(err)
    } else {
      getMonth.push('Month', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
      getfrek.push('Frequents', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

      for (var i = 0; i < rows.length; i++) {
        var month = rows[i].month;
        getfrek.fill(rows[i].frekuensi, month, (month+1));
      }

      temp_monthfrek.push(getMonth, getfrek);
      console.log(temp_monthfrek);
    }

    var trans_month = adapt(temp_monthfrek);
    console.log(trans_month);
    connection.query('SELECT gender, count(gender) as frek_gend FROM students GROUP BY gender', function(err, rows, fields) {
      if (err) {
        console.log(err)
      } else {
        getgender.push('gender')
        getfrekgen.push('frek gend')
        for (var j = 0 ; j < rows.length ; j++) {
          if (rows[j].gender === 'f') {
            getgender.push('FEMALE')
          } else {
            getgender.push('MALE')
          }
          getfrekgen.push(rows[j].frek_gend)       
        }
        temp_genderfrek.push(getgender,getfrekgen)
      }
      var trans_gend = adapt(temp_genderfrek);  
      console.log(trans_gend);
      console.log(trans_month);
      res.render('statistic',{obj1: JSON.stringify(trans_month), obj2: JSON.stringify(trans_gend)});
    });
  });
});

module.exports = router;

