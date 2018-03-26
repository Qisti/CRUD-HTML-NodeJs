const express = require('express');
const router = express.Router();
const connection = require('../src/db_connect');
const alert = require('alert-node');

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}

router.get('/input', function(req, res) {
  res.render('input');
});

router.get('/addUser', function(req, res) {
  res.render('inputUser');
})

module.exports = router;
