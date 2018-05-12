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
            if (p['ingredient'] == ingredient && p['country'] == req.params.country) {
                return p['name'];
            }
        }
    }).filter((p) => p !== undefined);

    res.send(drugs);
});

export default router;