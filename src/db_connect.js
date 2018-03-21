const mysql = require('mysql');
const express = require('express');
const config = require('../conf/config');

const connection = mysql.createConnection({
  host : config.database.host,
  user : config.database.user,
  password : config.database.password,
  database : config.database.database
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports = connection;