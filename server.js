var express = require('express');
var app = express();
var port = process.env.PORT || 8000;
var morgan = require('morgan');
var mongoose = require('mongoose');
var User = require('./app/models/user');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(morgan('dev'));

mongoose.connect('mongodb://admin:password123@ds115350.mlab.com:15350/shpeuf', function(err) {
  if (err) {
    console.log('\nDatabase connection error:\n' + err);
  } else {
    console.log('Succesfully connected to database');
  }
});

app.post('/users', function(req, res) {
  var user = new User();
  user.username = req.body.username;
  user.password = req.body.password;
  user.email = req.body.email;
  if (req.body.username == null || req.body.password == null || req.body.email == null || req.body.username == '' || req.body.password == '' || req.body.email == '') {
    res.send('Ensure username, password, and email were provided!')
  } else {
    user.save(function(err) {
      if (err) {
        res.send('Username or email already exists!');
      } else {
        res.send("\nUser created");
      }
    });
  }
});

app.listen(port, function() {
  console.log('\nRunning the server on port ' + port);
});
