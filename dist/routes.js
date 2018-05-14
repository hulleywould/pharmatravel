"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _request = require("request");

var _request2 = _interopRequireDefault(_request);

var _htmlparser = require("htmlparser2");

var _htmlparser2 = _interopRequireDefault(_htmlparser);

var _https = require("https");

var _https2 = _interopRequireDefault(_https);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _inspector = require("inspector");

var _output = require("./output/output");

var _output2 = _interopRequireDefault(_output);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', function (req, res) {
    res.send("hey there");
});

router.get('/result/:product/:country', function (req, res) {
    var ingredient = _output2.default.data.map(function (p) {
        for (var key in p) {
            if (p['name'] == req.params.product) {
                return p['ingredient'];
            }
        }
    }).filter(function (p) {
        return p !== undefined;
    }).toString();
    var drugs = _output2.default.data.map(function (p) {
        for (var key in p) {
            if (p['ingredient'] == ingredient && p['country'] == req.params.country || p['name'] == req.params.product && p['country'] == req.params.country && p['ingredient'] == ingredient) {
                return p['name'];
            }
        }
    }).filter(function (p) {
        return p !== undefined;
    });

    res.send(drugs);
});

router.get('/allcountries', function (req, res) {
    var countries = _output2.default.data.map(function (c) {
        return c.country;
    }).filter(function (v, i, a) {
        return a.indexOf(v) === i;
    });
    res.json(countries);
});

router.get('/alldrugs', function (req, res) {
    var drugs = _output2.default.data.map(function (d) {
        return d.name;
    }).filter(function (v, i, a) {
        return a.indexOf(v) === i;
    });
    res.send(drugs);
});

exports.default = router;