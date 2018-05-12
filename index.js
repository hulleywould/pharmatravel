const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 8080;
const router = require("./routes").default;
const cors = require("cors");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/dist'));

app.use('/', router);

app.listen(process.env.PORT || port);