var express = require('express');
var router = express.Router();
var mysql = require('mysql');

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
}

router.get('/students', function(req, res) {
  var studentList = [];

  // Do the query to get data.
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

        // Create an object to save current row's data
        var student = {
          'id_student':rows[i].id_student,
          'name':rows[i].name,
          'gender': gender,
          'date_of_birth':date_of_birth,
          'address':rows[i].address
        }
        // Add object into array
        studentList.push(student);
    }

    // Render index.pug page using array 
    res.render('index', {title: 'Student List', data: studentList});
    }
  });
});

router.get('/', function(req, res) {
  res.send('WELCOME');
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
        
  			res.render('edit', {
  				title: 'Edit Student', 
  				Id_student: rows[0].id_student,
  				Name: rows[0].name,
  				Address: rows[0].address,
  			  Gender: rows[0].gender,
  				Date_of_birth: dateOB
  			});
      
      }
              
      });
});

// router.get('/update', function(req, res) {
//   var insert = {
//     id_student: req.body.id_student,
//     name: req.body.name,
//     gender: req.body.gender,
//     date_of_birth: req.body.date_of_birth,
//     address: req.body.address
// }
  
//   connection.query('UPDATE students SET ? ', insert, 'WHERE id_student= ?', id, function(err, rows) {
//     if (err) throw err;
//     res.redirect('/students');
//   })
// })

router.post('/update', function(req, res) {
  var id_student = req.body.id_student;
  var name= req.body.name;
  var gender= req.body.gender;
  var date_of_birth= req.body.date_of_birth;
  var address= req.body.address;
  var postData  = {id_student: id_student, name: name, address: address, gender: gender, date_of_birth: date_of_birth};
 
  //student_id = ?, name = ?, address = ?, gender = ?, date_of_birth = ? WHERE student_id = ?', [studentId, studentName, studentAddress, studentGender, studentDoB,
  // res.send('berhasil');
  connection.query('UPDATE students SET id_student = ?, name = ?, gender = ?, date_of_birth = ?, address = ? WHERE id_student = ?', [id_student, name, gender, date_of_birth, address, id_student], function(err, rows) {
    if (err) throw err;
  });
  res.redirect('/students');

  // res.redirect('/students');
});

router.post('/delete-student/:id', function(req, res) {
  connection.query('DELETE FROM students WHERE id_student = ?', [req.params.id], function(err, result) {
    if(err) throw err
    res.redirect('/students');
  });
})


module.exports = router;
