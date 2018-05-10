import express from "express";
import request from "request";
import htmlparser from "htmlparser2";
import https from "https";
import http from "http";
import { url } from "inspector";

const router = express.Router();


router.get('/', (req, res) => {
    res.send("hey there");
});

router.get('/about', (req, res) => {
    request
        .get('https://www.drugs.com/international/paracetamol.html')
        .on('response', function(response) {
            console.log(response.statusCode) // 200
            console.log(response.headers['content-type']) // 'image/png'
            
            res.send(response);
        });
});

router.get('/fetch', (req, res, next) => {
    if (req.query.url === undefined) {
        res.send({ message: "url cannot be undefined" });
    }

    let urlPrefix = req.query.url.match(/.*?:\/\//g);
    req.query.url = req.query.url.replace(/.*?:\/\//g, "");
    let path = req.query.url.match(/(\/.*)(html)$/);
    if (path == null) {
        path = "/international/panado.html";
    } else {
        path = path[0];
    }
    console.log(path);
    let options = {
        hostname: req.query.url
    };

    if (urlPrefix !== undefined && urlPrefix !== null && urlPrefix[0] === "https://") {
        options.port = 443;
        options.path = path;
        https.get("https://www.drugs.com/international/paracetamol.html", (result) => {
            processResponse(result);
        }).on('error', (e) => {
            res.send({ message: e.message });
        });
    } else {
        options.port = 80;
        http.get(options, (result) => {
            processResponse(result);
        }).on('error', (e) => {
            res.send({ message: e.message });
        });
    }

    let processResponse = (result) => {
        let data = "";
        let string = "";
        result.on("data", (chunk) => {
            data += chunk;
            string = data.match(/<ul>(.*)<\/ul>/ig);
        });
        console.log(string);
        let tags = [];
        let tagsCount = {};
        let tagsWithCount = [];
        result.on("end", (chunk) => {
            let parser = new htmlparser.Parser({
                onopentag: function(name, attribs) {
                    if (tags.indexOf(name) === -1) {
                        tags.push(name);
                        tagsCount[name] = 1;                        
                    } else {
                        tagsCount[name]++;
                    }
                },
                onend: function() {
                    for(var i = 0; i < tags.length; i++) {
                        tagsWithCount.push({name: tags[i], count: tagsCount[tags[i]]});
                    }
                }
            }, { decodeEntities: true });
            parser.write(data);
            parser.end();
            res.send({ website: req.query.url, port: options.port, path: options.path, data: data, tags: tagsWithCount });
        })
    }

});






module.exports = router;