import BAPLive from "../lib/BAPLive";
import {MongoClient} from 'mongodb';

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', async (req, res, next) => {
    const {email, password} = req.query;
    console.log(req);
    MongoClient.connect('mongodb://localhost:27017/baplive', async (err, db) => {
        const result = await db.collection('User').findOne({email, password});
        if (result) {
            
        }
        res.jsonp(
            result
        )
    });


});


module.exports = router;
