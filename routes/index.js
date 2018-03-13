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
  // var basedOn = req.body.basedOn;
  // var search = req.body.search;

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
        var dateOE = formatDateForPug(rows[0].date_of_entry);

  			res.render('edit', {
  				title: 'Edit Student', 
  				Id_student: rows[0].id_student,
  				Name: rows[0].name,
  				Address: rows[0].address,
  			  Gender: rows[0].gender,
          Date_of_birth: dateOB,
          Mail: rows[0].mail,
          Date_of_entry: rows[0].dateOE
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

  connection.query('UPDATE students SET id_student = ?, name = ?, gender = ?, date_of_birth = ?, address = ?, mail = ?, date_of_entry = ? WHERE id_student = ?', [id_student, name, gender, date_of_birth, address, id_student, mail, date_of_entry], function(err, rows) {
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

    // Render index.pug page using array 
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

router.get('/statistic', function(req, res)  {
  var getMonth = []; getfrek = []; temp_monthfrek=[]; trans_month=[]; getgender = []; getfrekgen = []; temp_genderfrek=[]; trans_gend=[];

  connection.query('SELECT month(date_of_entry) AS month, count(*) AS frekuensi FROM students GROUP BY month(date_of_entry);', function(err, rows, fields) {
    if (err) {
      console.log(err)
    } else {
      getMonth.push('Month');
      getfrek.push('Freq');
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].month === 1) {
          getMonth.push("January");
        } else if (rows[i].month === 2) {
          getMonth.push("February");
        } else if (rows[i].month === 3) {
          getMonth.push("March");
        } else if (rows[i].month === 4) {
          getMonth.push("April");
        } else if (rows[i].month === 5) {
          getMonth.push("May");
        } else if (rows[i].month === 6) {
          getMonth.push("June");
        } else if (rows[i].month === 7) {
          getMonth.push("July ");
        } else if (rows[i].month === 8) {
          getMonth.push("August");
        } else if (rows[i].month === 9) {
          getMonth.push("September ");
        } else if (rows[i].month === 10) {
          getMonth.push("October ");
        } else if (rows[i].month === 11) {
          getMonth.push("November");
        } else if (rows[i].month === 12) {
          getMonth.push("December");
        }
        getfrek.push(rows[i].frekuensi)   
          
      }
      temp_monthfrek.push(getMonth,getfrek)  
      var trans_month = adapt(temp_monthfrek);
      console.log(trans_month);  
    }

});

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
    res.render('statistic',{obj1: JSON.stringify(trans_month), obj2: JSON.stringify(trans_gend)});
  });

});





module.exports = router;
