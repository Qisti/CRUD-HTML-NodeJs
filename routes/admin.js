const express = require('express');
const router = express.Router();
const alert = require('alert-node');
const connection = require('../src/db_connect');
const validator = require('express-validator');
const validator_email = require('email-validator');

router.get('/list', function(req, res) {
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
  
});

router.post('/add', function(req, res) {
  req.checkBody("id_student",'input name').notEmpty();  
  req.checkBody("name",'input name').notEmpty();
  req.checkBody("gender",'input gender').notEmpty();
  var errors = req.validationErrors();

  if (errors){
    alert("Please input valid format !");
  } else {
    var username = req.body.username;
    var email = req.body.email;
    var password2= req.body.password2;
    var password = req.body.password;
    var val = validator_email.validate(email);
  
    console.log(username, password2)
  
    if (password === password2) {
      if(val === false) {
        alert('Please insert valid email !');
      } else {
        connection.query('SELECT email FROM users WHERE email = ?', [email], function(err, rows) {
          if(err) throw err;
          if(rows.length>0) {
            alert('Email already in use !');
          }
          connection.query('SELECT username FROM users WHERE username = ?', [username], function(err, rows) {
            if(rows.length>0) {
              alert("Username already in use !")
            } else {
                connection.query('INSERT INTO users (username, password, email) VALUES (? , sha1("7fa73b47df808d36c5fe328546ddef8b9011b2c6 ? "), ? )', [username, password, email], function(err, res) {
                  if (err) throw err;
                  console.log("admin berhasil ditambah");
                  alert("Succes input admin !");   
              });
                res.redirect('/admin/list');
              }
            }); 
        });
      }
    } else{
      alert("Password doesn't match !");
    }
  }
    
  });

  router.post('/delete/:id', function(req, res) {
    connection.query('DELETE from users WHERE id_user = ?', [req.params.id], function(err, rows){
      if(err) throw err;
      res.redirect('/adminList');
    })
  })

module.exports = router;

