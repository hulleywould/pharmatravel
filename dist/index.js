"use strict";

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var port = 8080;
var router = require("./routes");
var cors = require("cors");

app.use(cors());

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(express.static(__dirname + '/dist'));

app.use('/', router);

app.listen(process.env.PORT || port);