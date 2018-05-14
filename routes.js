import express from "express";
import request from "request";
import htmlparser from "htmlparser2";
import https from "https";
import http from "http";
import { url } from "inspector";
import dat from './output/output'
const router = express.Router();


router.get('/', (req, res) => {
    res.send("hey there");
});

router.get('/result/:product/:country', (req, res) => {
    let ingredient = dat.data.map((p) => {
        for (let key in p) {
            if (p['name'] == req.params.product) {
                return p['ingredient'];
            }
        }
    }).filter((p) => p !== undefined).toString();
    let drugs = dat.data.map((p) => {
        for (let key in p) {
            if (p['ingredient'] == ingredient && p['country'] == req.params.country ||
                p['name'] == req.params.product && p['country'] == req.params.country && p['ingredient'] == ingredient) 
            {
                return p['name'];
            }
        }
    }).filter((p) => p !== undefined);

    res.send(drugs);
});

router.get('/allcountries', (req, res) => {
    let countries = dat.data.map((c) => c.country).filter((v, i, a) => a.indexOf(v) === i);
    res.json(countries);
});

router.get('/alldrugs', (req, res) => {
    let drugs = dat.data.map((d) => d.name).filter((v, i, a) => a.indexOf(v) === i)
    res.send(drugs);
});

export default router;