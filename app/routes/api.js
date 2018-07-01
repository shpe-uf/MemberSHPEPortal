var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = 'loremipsum';

module.exports = function(router) {
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
          res.json({
            success: false,
            message: 'User already exists!'
          });
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
    }).select('email username password firstName lastName').exec(function(err, user) {
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
              lastName: user.lastName
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

  router.use(function(req, res, next) {
    var token = req.body.token || req.body.query || req.headers['x-access-token'];

    if(token) {
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
