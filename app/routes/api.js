require('dotenv').config();

var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = 'loremipsum';
var nodemailer = require('nodemailer');

module.exports = function(router) {

  var transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS
    }
  });

  router.post('/users', function(req, res) {
    var user = new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.major = req.body.major;
    user.year = req.body.year;
    user.username = req.body.username;
    user.email = req.body.email;
    user.password = req.body.password;
    // user.listServ = req.body.listServ;

    if (req.body.username == null || req.body.password == null || req.body.email == null || req.body.firstName == null || req.body.lastName == null || req.body.major == null || req.body.year == null || req.body.username == '' || req.body.password == '' || req.body.email == '' || req.body.firstName == '' || req.body.lastName == '' || req.body.major == '' || req.body.year == '') {
      res.json({
        success: false,
        message: 'Make sure you filled out the entire form!'
      });
    } else {
      user.save(function(err) {
        if (err) {

          if (err.errors != null) {
            if (err.errors.firstName) {
              res.json({
                success: false,
                message: err.errors.firstName.properties.message
              });
            } else if (err.errors.lastName) {
              res.json({
                success: false,
                message: err.errors.lastName.properties.message
              });
            } else if (err.errors.email) {
              res.json({
                success: false,
                message: err.errors.email.properties.message
              });
            } else if (err.errors.username) {
              res.json({
                success: false,
                message: err.errors.username.properties.message
              });
            } else if (err.errors.password) {
              res.json({
                success: false,
                message: err.errors.password.properties.message
              });
            } else {
              res.json({
                success: false,
                message: err
              });
            }
          } else if (err) {
            if (err.code == 11000) {
              res.json({
                success: false,
                message: 'Username and/or email already taken.'
              });
            } else {
              res.json({
                success: false,
                message: err
              });
            }
          }

        } else {
          res.json({
            success: true,
            message: 'Congratulations! Welcome!'
          });
        }
      });
    }
  });

  router.post('/authenticate', function(req, res) {
    User.findOne({
      username: req.body.username
    }).select('email username password firstName lastName major year points').exec(function(err, user) {
      if (err) throw err;

      if (!user) {
        res.json({
          success: false,
          message: 'User not found'
        });
      } else if (user) {
        if (!req.body.password) {
          res.json({
            success: false,
            message: 'Enter a password'
          });
        } else {
          var validPassword = user.comparePassword(req.body.password);

          if (!validPassword) {
            res.json({
              success: false,
              message: 'Wrong password'
            });
          } else {

            var token = jwt.sign({
              username: user.username,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              major: user.major,
              year: user.year,
              points: user.points
            }, secret, {
              expiresIn: '24h'
            });

            res.json({
              success: true,
              message: 'User authenticated',
              token: token
            });
          }
        }
      }
    });
  });

  router.get('/forgetusername/:email', function(req, res) {
    console.log("API LINE 145");
    console.log(req);
    User.findOne({
      email: req.params.email
    }).select('email firstName username').exec(function(err, user) {
      if (err) {
        res.json({
          success: false,
          message: err
        });
      } else {
        if (!req.params.email) {
          res.json({
            success: false,
            message: 'No email was provided'
          })
        } else {
          if (!user) {
            res.json({
              success: false,
              message: 'Email not found'
            });
          } else {
            var email = {
              from: 'local@localhost.com',
              to: user.email,
              subject: 'MemberSHPE UF Username Request',
              text: 'Hello ' + user.firstName + ', \n\nYou recently requested your username. Please save it in your files: ' + user.username,
              html: 'Hello<strong> ' + user.firstName + '</strong>,<br><br>You recently requested your username. Please save it in your files: <strong>' + user.username + '</strong>.'
            };

            transporter.sendMail(email, function(err, info) {
              if (err) {
                console.log(err);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });

            res.json({
              success: true,
              message: 'Username has been sent to email.'
            });
          }
        }
      }
    });
  });

  router.use(function(req, res, next) {
    var token = req.body.token || req.body.query || req.headers['x-access-token'];

    if (token) {
      jwt.verify(token, secret, function(err, decoded) {
        if (err) {
          res.json({
            success: false,
            message: 'Token invalid'
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      res.json({
        success: false,
        message: 'No token provided'
      });
    }
  });

  router.post('/me', function(req, res) {
    res.send(req.decoded);
  });

  return router;
}
