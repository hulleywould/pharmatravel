"use strict";

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', function (req, res) {
    res.send("hey there");
});

router.get('/about', function (req, res) {
    _request2.default.get('https://www.drugs.com/international/paracetamol.html').on('response', function (response) {
        console.log(response.statusCode); // 200
        console.log(response.headers['content-type']); // 'image/png'

        res.send(response);
    });
});

router.get('/fetch', function (req, res, next) {
    if (req.query.url === undefined) {
        res.send({ message: "url cannot be undefined" });
    }

    var urlPrefix = req.query.url.match(/.*?:\/\//g);
    req.query.url = req.query.url.replace(/.*?:\/\//g, "");
    var path = req.query.url.match(/(\/.*)(html)$/);
    if (path == null) {
        path = "/international/panado.html";
    } else {
        path = path[0];
    }
    console.log(path);
    var options = {
        hostname: req.query.url
    };

    if (urlPrefix !== undefined && urlPrefix !== null && urlPrefix[0] === "https://") {
        options.port = 443;
        options.path = path;
        _https2.default.get("https://www.drugs.com/international/paracetamol.html", function (result) {
            processResponse(result);
        }).on('error', function (e) {
            res.send({ message: e.message });
        });
    } else {
        options.port = 80;
        _http2.default.get(options, function (result) {
            processResponse(result);
        }).on('error', function (e) {
            res.send({ message: e.message });
        });
    }

    var processResponse = function processResponse(result) {
        var data = "";
        var string = "";
        result.on("data", function (chunk) {
            data += chunk;
            string = data.match(/<ul>(.*)<\/ul>/ig);
        });
        console.log(string);
        var tags = [];
        var tagsCount = {};
        var tagsWithCount = [];
        result.on("end", function (chunk) {
            var parser = new _htmlparser2.default.Parser({
                onopentag: function onopentag(name, attribs) {
                    if (tags.indexOf(name) === -1) {
                        tags.push(name);
                        tagsCount[name] = 1;
                    } else {
                        tagsCount[name]++;
                    }
                },
                onend: function onend() {
                    for (var i = 0; i < tags.length; i++) {
                        tagsWithCount.push({ name: tags[i], count: tagsCount[tags[i]] });
                    }
                }
            }, { decodeEntities: true });
            parser.write(data);
            parser.end();
            res.send({ website: req.query.url, port: options.port, path: options.path, data: data, tags: tagsWithCount });
        });
    };
});

module.exports = router;