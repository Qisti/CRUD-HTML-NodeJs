const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const flash = require('connect-flash');
const alert = require('alert-node');
const connection = require('../src/db_connect');
const moment = require('moment');

function getStudentGender(studentGender){
  if(studentGender === 'f'){
    gender = 'Female';
  } else {
    gender = 'Male';
  }
  return gender;
};

router.get('/', function(req, res) {
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

        // Create an object to save current row's data
        var student = {
          'id_student':rows[i].id_student,
          'name':rows[i].name,
          'gender': gender,
          'date_of_birth':rows[i].date_of_birth,
          'address':rows[i].address,
          'mail': rows[i].mail,
          'date_of_entry': moment(rows[i].date_of_entry).format('DD-MM-YYYY')
        }
        // Add object into array
        studentList.push(student);
      }

    // Render index.pug page using array 
    res.render('index', {title: 'Student List', data: studentList});
  }
});
});

// format date for pug = YYYY-MM-DD 
// format date for mysql = DD-MM-YYYY

router.post('/input', function(req, res) {
  var insert = {
    id_student: req.body.id_student,
    name: req.body.name,
    gender: req.body.gender,
    date_of_birth: req.body.date_of_birth,
    address: req.body.address,
    mail: req.body.mail
  }
  var id_student= req.body.id_student;
  var now = new Date ();
  now = moment(now).format('YYYY-MM-DD');
  var date = req.body.date_of_birth;
  var entryDate = req.body.date_of_entry;

  
  if (date > now || entryDate > now){
    alert('Invalid input date !');
  } else {
    connection.query('SELECT * FROM students WHERE id_student = ?', id_student, function(err, rows, fields) {
      if (err) throw err;
      if(rows.length > 0) {
        alert('Your id duplicated !');
      } else {
        connection.query("INSERT INTO students SET ? ", insert, function(err, res) {
          if (err) throw err;
        });
        res.redirect('/students');
      }
      
    });
  }
});


router.get('/id', function(req, res){
  connection.query('SELECT * FROM students WHERE id_student = ?', [req.params.id], function(err, rows, fields) {
    if(err) throw err
      
    // if user not found
  if (rows.length <= 0) {
    res.redirect('/')
  } else { 

      res.render('edit', {
        title: 'Edit Student', 
        sid_student: rows[0].id_student,
        sname: rows[0].name,
        saddress: rows[0].address,
        sgender: rows[0].gender,
        sdate_of_birth: moment(rows[0].date_of_birth).format('YYYY-MM-DD'),
        smail: rows[0].mail,
        sdate_of_entry: moment(rows[0].date_of_entry).format('YYYY-MM-DD'),
        sOldId: rows[0].id_student_id
      })
    }            
  });
});

router.get('/update/:id', function(req, res){
  connection.query('SELECT * FROM students WHERE id_student = ?', [req.params.id], function(err, rows, fields) {
    if(err) throw err;
    
      // if user not found
      if (rows.length <= 0) {
        res.redirect('/students')
      }
      else { // if user found

        res.render('edit', {
          title: 'Edit Student', 
          Id_student: rows[0].id_student,
          Name: rows[0].name,
          Address: rows[0].address,
          Gender: rows[0].gender,
          Date_of_birth: moment(rows[0].dateOB).format('YYYY-MM-DD'),
          Mail: rows[0].mail,
          Date_of_entry: moment(rows[0].dateOE).format('YYYY-MM-DD')
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
  
  var dateNow = new Date();
  var now = moment(dateNow).format('YYYY-MM-DD')
  // var now = formatDateForPug(dateNow);
  var date = req.body.date_of_birth;
  var entryDate = req.body.date_of_entry;
  
  if (date > now || entryDate > now){
    alert('Invalid input date !');
  } else {
    connection.query("UPDATE students SET id_student = ?, name = ?, gender = ?, date_of_birth = ?, address = ?, mail = ? WHERE id_student = ?", [id_student, name, gender, date_of_birth, address, mail, id_student ], function(err, rows) {
      if (err) throw err;
      console.log(rows);
      res.redirect('/students');
  });
    
  }
});

router.post('/delete/:id', function(req, res) {
  connection.query('DELETE FROM students WHERE id_student = ?', [req.params.id], function(err, result) {
    if(err) throw err
      res.redirect('/students');
  });
});

router.post('/filter', function(req,res){
  // var studentList = [];
  var search = req.body.search;
  var basedOn = req.body.basedOn;
  var order = req.body.order;
  var sql = "SELECT * FROM students WHERE "+basedOn+" LIKE '%"+search+"%' ORDER BY "+basedOn+" "+order+"";

  connection.query(sql,function(err, rows, fields) {
    if (err) {
      res.status(500).json({"status_code": 500,"status_message": "internal server error"});
    } else {
      console.log(rows);

      console.log(rows.length);
      res.render('index', {title: 'Student List', data: rows});
    }
  });
});



module.exports = router;
