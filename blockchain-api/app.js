var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
const fs = require("fs");
var web3Lib = require('web3');
var cors = require('cors');
var createError = require('http-errors');

var indexRouter = require('./src/routes/index');
var testRouter = require('./src/routes/test-contract-route');
let chainRouter = require('./src/routes/chain-route');

var app = express();
app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.disable('etag');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let baseURL = '/blockchain-api';

app.use(baseURL+'/', indexRouter);
app.use(baseURL+'/chain', chainRouter);
app.use(baseURL+'/test', testRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    console.log(err);
    err.path = req.path;
    err.timestamp = Date.now();
    res.status(err.status);
    res.send(err);
});


var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "licenta-dsrl"
});


// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});


// var ip = process.env.GETH_URL
// var web3 = new web3Lib("http://"+ip)
var web3 = new web3Lib("http://localhost:8540");

global.web3 = web3;
global.db = db;
global.createError = createError;


module.exports = app;

