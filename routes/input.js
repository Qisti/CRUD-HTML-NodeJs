var express = require('express');
var router = express.Router();
var mysql = require('mysql');

/* GET home page. */
router.get('/', function(req, res){
  res.render('index');
});

router.get('/students', function(req, res) {
  res.render('index');
})

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

router.post('/', function(req, res) {
  var insert = {
    id_student: req.body.id_student,
    name: req.body.name,
    gender: req.body.gender,
    date_of_birth: req.body.date_of_birth,
    address: req.body.address
  }
  
  connection.query("INSERT INTO students SET ? ", insert, function(err, res) {
  if (err) throw err;
  });

  res.redirect('/students');
});


router.get('/students/id', function(req, res){
	connection.query('SELECT * FROM students WHERE id_student = ?', [req.params.id], function(err, rows, fields) {
		if(err) throw err
		
		// if user not found
		if (rows.length <= 0) {
				res.redirect('/')
		} else { 
			var date_of_birth = formatDateForPug(rows[0].date_of_birth);
			// if user found
			// render to views/index.pug template file
			res.render('edit', {
				title: 'Edit Student', 
				sid_student: rows[0].id_student,
				sname: rows[0].name,
				saddress: rows[0].address,
				sgender: rows[0].gender,
				sdate_of_birth: date_of_birth,
				sOldId: rows[0].id_student_id
			})
		}            
	});
});



module.exports = router;
