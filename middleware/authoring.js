var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
app.use(bodyParser.json());

module.exports.isloggedIn = function isLoggedIn(req,res,next){
    if(req.headers.authorization)
    {
        next();
    }else{
        res.json({
            message:'unauthorized'
        },400);
    }
};
module.exports.checker = function checker(req,res,next)
{
    var c = req.headers.authorization.split(' ')[1];
    var cverify = jwt.verify(c,'sdfiua7938r');
    if(cverify.type ==='vendor')
    {
        next();
    }
    else
    {
        res.json({
            message:"unauthorized .... only for vendor"
        },400);
    }
}