var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
//file config chua secretkey va database
var config = require('./config.js');
//driver mongodb 
var mongoose = require('mongoose');
//doi tuong user
var User = require('./user');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//ket noi database
mongoose.connect(config.database);


//ley secret key cua token
app.set('secretKey', config.secret);

//them user
app.get('/addUser', (req,res) => {

    var user1 = new User({
        id: 'delpast1',
        password: '13456'
    });

    user1.save((err) => {
    if (err){
        console.log(err);
    } else {
        console.log('successfully');
        res.json({ message: 'success'});
        }   
    });
});

//show user
var router = express.Router();
app.use('/api', router);

router.get('/', (req,res) => {
    res.json({message: 'Welcome to my first API'});
});

router.get('/users', (req,res) => {
    User.find({}, (err, users) => {
        res.json(users);
    })
});


router.get('/calculator', (req,res) =>{
    res.json({message: 'Calculator'});
});

router.post('/calculator', (req,res) => {
    //let id = req.body.id;
    //let password = req.body.password;
    User.findOne({
        id: req.body.id
    }, (err, user) => {
        if (err) console.log(err);

        if (!user) {
            res.json({ message: 'Sai id'});
        } else if (user){
            if (user.password != req.body.password){
                res.json({ message: 'Sai password'});
            } else {
                var token = jwt.sign(user, app.get('secretKey'), {
                    expiresIn: 60*3
                });

                let numberA = parseInt(req.body.numberA);
                let numberB = parseInt(req.body.numberB);
                let operation = req.body.operation;
                let result;

                if (operation=='add'){
                    result = numberA + numberB;
                } else if (operation=='sub')
                    result = numberA - numberB;
                else if (operation=='div'){
                    if (numberB==0) result = 'Khong the chia cho 0';
                    else result = numberA/numberB;
                }
                else result = numberA*numberB;

                response = {
                    numberA: numberA,
                    numberB: numberB,
                    operation: operation,
                    result: result,
                    token: token
                };

                res.end(JSON.stringify(response));
            }
        }
    });
});

var server = app.listen(8081, () => {
    var port = server.address().port;
    console.log('connected at '+port);
});
