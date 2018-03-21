const express = require('express');
const router = express.Router();
const connection = require('../src/db_connect');

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

router.get('/', function(req, res)  {

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