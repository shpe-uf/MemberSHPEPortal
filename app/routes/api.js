require('dotenv').config();

var User = require('../models/user');
var Code = require('../models/code');
var Request = require('../models/request');
var Alumni = require('../models/alumni');
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

  // ENDPOINT TO CREATE/REGISTER USERS
  router.post('/users', function(req, res) {
    var user = new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.major = req.body.major;
    user.year = req.body.year;
    user.nationality = req.body.nationality;
    user.ethnicity = req.body.ethnicity;
    user.sex = req.body.sex;
    user.email = req.body.email;
    user.username = req.body.username;
    user.password = req.body.password;
    user.listServ = req.body.listServ;

    if (req.body.username == null || req.body.password == null || req.body.email == null || req.body.firstName == null || req.body.lastName == null || req.body.major == null || req.body.year == null || req.body.nationality == null || req.body.ethnicity == null || req.body.sex == null || req.body.year == null || req.body.username == '' || req.body.password == '' || req.body.email == '' || req.body.firstName == '' || req.body.lastName == '' || req.body.major == '' || req.body.year == '' || req.body.nationality == '' || req.body.ethnicity == '' || req.body.sex == '') {
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

  // ENDPOINT TO CREATE EVENT CODES
  router.post('/codes', function(req, res) {
    if (req.body.name == null || req.body.code == null || req.body.type == null || req.body.expiration == null || req.body.name == '' || req.body.code == '' || req.body.type == '' || req.body.expiration == '') {
      res.json({
        success: false,
        message: 'Make sure you filled out the entire form!'
      });
    } else {
      var code = new Code();
      code.name = req.body.name;
      code.code = req.body.code.toLowerCase();
      code.type = req.body.type;

      if (code.type == 'General Body Meeting' || code.type == 'Cabinet Meeting' || code.type == 'Workshop' || code.type == 'Social' || code.type == 'Form/Survey') {
        code.points = 1;
      } else if (code.type == 'Corporate Event') {
        code.points = 2;
      } else if (code.type == 'Fundraiser') {
        code.points = 3;
      } else if (code.type == 'Volunteering') {
        code.points = 4;
      } else if (code.type == 'Miscellaneous') {
        code.points = 5;
      } else {
        code.points = 0;
      }

      code.expiration = Date.now() + (req.body.expiration * 60 * 60 * 1000);

      code.save(function(err) {
        if (err) {
          if (err.errors != null) {
            if (err.errors.name) {
              res.json({
                success: false,
                message: err.errors.name.properties.message
              });
            } else if (err.errors.code) {
              res.json({
                success: false,
                message: err.errors.code.properties.message
              });
            } else if (err.errors.type) {
              res.json({
                success: false,
                message: err.errors.type.properties.message
              });
            } else if (err.errors.points) {
              res.json({
                success: false,
                message: err.errors.points.properties.message
              });
            } else if (err.errors.expiration) {
              res.json({
                success: false,
                message: err.errors.expiration.properties.message
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
                message: 'Event name and/or code already taken.'
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
            message: "Success! Event created!"
          });
        }
      });
    }
  });

  // ENDPOINT TO SIGN IN AND AUTHENTICATE USER
  router.post('/authenticate', function(req, res) {
    User.findOne({
      username: req.body.username
    }).select().exec(function(err, user) {
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
              email: user.email
            }, secret, {
              expiresIn: '1h'
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

  // ENDPOINT TO SEND THE USER A FORGOT USERNAME EMAIL
  router.get('/forgetusername/:email', function(req, res) {
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
          });
        } else {
          if (!user) {
            res.json({
              success: false,
              message: 'Email not found'
            });
          } else {
            var email = {
              from: process.env.USER,
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

  // ENDPOINT TO SEND THE USER A RESET PASSWORD EMAIL
  router.put('/resetpassword/', function(req, res) {
    User.findOne({
      username: req.body.username
    }).select('username email resettoken firstName').exec(function(err, user) {

      if (err) throw err;

      if (!user) {
        res.json({
          success: false,
          message: 'User not found'
        });
      } else {
        user.resettoken = jwt.sign({
          username: user.username,
          email: user.email,
        }, secret, {
          expiresIn: '24h'
        });

        user.save(function(err) {
          if (err) {
            res.json({
              success: false,
              message: err
            });
          } else {

            var email = {
              from: process.env.USER,
              to: user.email,
              subject: 'MemberSHPE UF Password Reset Link Request',
              text: 'Hello ' + user.firstName + ', You recently requested a password reset link. Please click on the link below to reset your password: https://membershpeuf.herokuapp.com/reset/' + user.resettoken,
              html: 'Hello<strong> ' + user.firstName + '</strong>,<br><br>You recently requested a password reset link. Please click on the link below to reset your password:<br><br><a href="http://membershpeuf.herokuapp.com/reset/' + user.resettoken + '">Password Reset Link</a>'
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
              message: 'Please check your email for password reset link'
            });
          }
        });
      }
    });
  });

  // ENDPOINT TO RESET THE PASSWORD
  router.get('/resetpassword/:token', function(req, res) {
    User.findOne({
      resettoken: req.params.token
    }).select().exec(function(err, user) {
      if (err) throw err;

      var token = req.params.token;

      jwt.verify(token, secret, function(err, decoded) {
        if (err) {
          res.json({
            success: false,
            message: 'Password reset link has expired'
          });
        } else {
          if (!user) {
            res.json({
              success: false,
              message: 'Password reset link has expired'
            });
          } else {
            res.json({
              success: true,
              user: user
            });
          }
        }
      });

    });
  });

  // ENDPOINT TO SAVE PASSWORD
  router.put('/savepassword', function(req, res) {
    User.findOne({
      username: req.body.username
    }).select('firstName username email password resettoken').exec(function(err, user) {
      if (err) throw err;

      if (req.body.password == null || req.body.password == '') {
        res.json({
          success: false,
          message: 'Password not provided.'
        });
      } else {
        user.password = req.body.password;
        user.resettoken = false;

        user.save(function(err) {
          if (err) {
            res.json({
              success: false,
              message: err
            });
          } else {

            var email = {
              from: process.env.USER,
              to: user.email,
              subject: 'MemberSHPE UF Password Reset Notification',
              text: 'Hello ' + user.firstName + ', This email is to notify you that your password was reset at MemberSHPE UF',
              html: 'Hello<strong> ' + user.firstName + '</strong>,<br><br>This email is to notify you that your password was reset at MemberSHPE UF'
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
              message: 'Password has been reset'
            });
          }
        });
      }
    });
  });

  // MIDDLEWARE TO LOG USER IN
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

  // ENDPOINT TO SEND USER PROFILE INFORMATION
  router.post('/me', function(req, res) {
    User.findOne({
      username: req.decoded.username
    }).select().exec(function(err, user) {
      res.send(user);
    });
  });

  // ENDPOINT TO RENEW THE USER TOKEN
  router.get('/renewtoken/:username', function(req, res) {
    User.findOne({
      username: req.params.username
    }).select().exec(function(err, user) {
      if (!user) {
        res.json({
          success: false,
          message: 'No user was found'
        });
      } else {
        var newToken = jwt.sign({
          username: user.username,
          email: user.email
        }, secret, {
          expiresIn: '1h'
        });
        res.json({
          success: true,
          message: newToken
        });
      }
    });
  });

  // ENDPOINT TO DETERMINE USER PERMISSION
  router.get('/permission', function(req, res) {
    User.findOne({
      username: req.decoded.username
    }, function(err, user) {
      if (err) throw err;

      if (!user) {
        res.json({
          success: false,
          message: 'User not found'
        });
      } else {
        res.json({
          success: true,
          message: user.permission
        });
      }
    });
  });

  // ENDPOINT TO RETRIEVE ALL USERS
  router.get('/admin', function(req, res) {
    User.find({

    }, function(err, users) {
      if (err) throw err;
      User.findOne({
        username: req.decoded.username
      }, function(err, mainUser) {
        if (err) throw err;

        if (!mainUser) {
          res.json({
            success: false,
            message: 'No user found'
          });
        } else {
          if (mainUser.permission === 'admin') {
            if (!users) {
              res.json({
                success: false,
                message: 'Users not found'
              });
            } else {
              res.json({
                success: true,
                message: users,
                permission: mainUser.permission
              });
            }
          } else {
            res.json({
              success: false,
              message: 'Insufficient permission'
            });
          }
        }
      });
    });
  });

  // ENDPOINT TO RETRIEVE EVENT CODES
  router.get('/getcodes', function(req, res) {
    Code.find({

    }, function(err, events) {
      if (err) throw err;
      User.findOne({
        username: req.decoded.username
      }, function(err, mainUser) {
        if (err) throw err;

        if (!mainUser) {
          res.json({
            success: false,
            message: 'No event found'
          });
        } else {
          if (mainUser.permission === 'admin') {
            if (!events) {
              res.json({
                success: false,
                message: 'Events not found'
              });
            } else {
              res.json({
                success: true,
                message: events,
                permission: mainUser.permission
              });
            }
          } else {
            res.json({
              success: false,
              message: 'Insufficient permission'
            });
          }
        }
      });
    });
  });

  // ENDPOINT TO ADD A REQUEST (*)
  router.put('/addrequest', function(req, res) {

    if (req.body.code == null || req.body.code == '') {
      res.json({
        success: false,
        message: 'No code was provided'
      });
    } else {
      Code.findOne({
        code: req.body.code.toLowerCase()
      }).select().exec(function(err, code) {

        if (err) throw err;

        if (code == null || code == '') {
          res.json({
            success: false,
            message: 'Event not found'
          });
        } else if (code.expiration < Date.now()) {
          res.json({
            success: false,
            message: 'Event code expired'
          });
        } else {
          User.findOne({
            username: req.decoded.username
          }, function(err, user) {
            if (err) throw err;

            var isDuplicate = false;

            for (var i = 0; i < user.events.length; i++) {
              if (user.events[i]._id.equals(code._id)) {
                isDuplicate = true;
                break;
              }
            }

            if (isDuplicate) {
              res.json({
                success: false,
                message: 'Event code already redeemed'
              });
            } else {
              if (!user) {
                res.json({
                  success: false,
                  message: 'Unable to add code to profile'
                });
              } else {

                if (code.points == 1 && code.type == 'General Body Meeting') {
                  User.findOneAndUpdate({
                    username: req.decoded.username,
                  }, {
                    $push: {
                      events: {
                        _id: code
                      }
                    },
                    $inc: {
                      points: code.points
                    }
                  }, function(err, user) {
                    if (err) throw (err);

                    if (!user) {
                      res.json({
                        success: false,
                        message: 'Unable to add code to profile'
                      });
                    } else {
                      res.json({
                        success: true,
                        message: "Points redeemed!"
                      });
                    }
                  });
                } else {

                  var newRequest = new Request();
                  newRequest.userId = user._id;
                  newRequest.eventId = code._id;
                  newRequest.firstName = user.firstName;
                  newRequest.lastName = user.lastName;
                  newRequest.username = user.username;
                  newRequest.eventName = code.name;
                  newRequest.type = code.type;
                  newRequest.points = code.points;
                  newRequest.status = 0;

                  Request.findOne({
                    userId: user._id,
                    eventId: code._id
                  }).select().exec(function(err, request) {
                    if (err) throw err;

                    if (request) {
                      res.json({
                        success: false,
                        message: 'Request has already been submitted.'
                      });
                    } else {
                      newRequest.save(function(err) {
                        if (err) {
                          res.json({
                            success: false,
                            message: err
                          });
                        } else {
                          res.json({
                            success: true,
                            message: 'Your request has been sent for approval.'
                          });
                        }
                      });
                    }
                  });
                }
              }
            }
          });
        }
      });
    }
  });

  // ENDPOINT TO GRAB EVENT CODE INFORMATION FOR INDIVIDUAL USERS
  router.get('/getcodeinfo/:code', function(req, res) {
    Code.findOne({
      _id: req.params.code
    }).populate().exec(function(err, event) {
      res.json({
        success: true,
        message: event
      });
    });
  });

  function createRequest(firstName, lastName, username, event, points) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.event = event;
    this.points = points;
  };

  // ENDPOINT TO GRAB ALL OF THE REQUESTS (*)
  router.get('/getrequests', function(req, res) {
    Request.find({

    }, function(err, requests) {
      if (err) throw err;
      User.findOne({
        username: req.decoded.username
      }, function(err, mainUser) {
        if (err) throw err;

        if (!mainUser) {
          res.json({
            success: false,
            message: 'No user found'
          });
        } else {
          if (mainUser.permission === 'admin') {
            if (!requests) {
              res.json({
                success: false,
                message: 'Requests not found'
              });
            } else {
              res.json({
                success: true,
                message: requests,
                permission: mainUser.permission
              });
            }
          } else {
            res.json({
              success: false,
              message: 'Insufficient permission'
            });
          }
        }
      });
    });
  });

  // ENDPOINT TO APPROVE REQUESTS
  router.put('/approverequest', function(req, res) {
    User.findOneAndUpdate({
      username: req.body.username,
    }, {
      $push: {
        events: {
          _id: req.body.eventId
        }
      },
      $inc: {
        points: req.body.points
      }
    }, function(err, user) {
      if (err) throw (err);

      if (!user) {
        res.json({
          success: false,
          message: 'Unable to accept request'
        });
      } else {
        res.json({
          success: true,
          message: "Points redeemed!"
        });
      }
    });


    Request.deleteOne({
      _id: req.body._id
    }, function(err, deletedRequest) {
      if (err) throw (err);
    });
  });

  // ENDPOINT TO DENY REQUESTS
  router.put('/denyrequest', function(req, res) {
    Request.deleteOne({
      _id: req.body._id
    }, function(err, deletedRequest) {
      if (err) throw (err);
    });
  });

  // ENDPOINT TO CALCULATE USER POINT PERCENTILE
  router.get('/getpercentile/:username', function(req, res) {

    var userPoints;
    var totalUsers;
    var belowUsers = 0;

    User.findOne({
      username: req.decoded.username
    }).populate().exec(function(err, user) {
      userPoints = user.points;
    });

    User.find({

    }).select('points').exec(function(err, userArray) {
      if (err) throw err;

      res.json({
        success: true,
        message: userArray
      });
    });
  });

  // ENDPOINT TO GRAB EVENT ATTENDANCE
  router.get('/getattendance/:eventid', function(req, res) {
    User.find({
      events: {
        _id: req.params.eventid
      }
    }).populate().exec(function(err, users) {
      if (err) throw err;

      res.json({
        success: true,
        message: users
      });
    });
  });

  // ENDPOINT TO MANUALLY INPUT POINTS FOR MEMBERS
  router.put('/manualinput', function(req, res) {

    console.log(req.body);

    if (req.body.member == null || req.body.member == "" || req.body.member == undefined || req.body.member.userName == null || req.body.member.userName == '' || req.body.member.userName == undefined) {
      res.json({
        success: false,
        message: 'No username was provided.'
      });
    } else {
      User.findOne({
        username: req.body.member.userName
      }).select().exec(function(err, user) {
        if (err) throw err;

        if (!user) {
          res.json({
            success: false,
            message: 'User not found'
          });
        } else {

          var isDuplicate = false;

          for (var i = 0; i < user.events.length; i++) {
            if (user.events[i]._id.equals(req.body.eventId)) {
              isDuplicate = true;
              break;
            }
          }

          if (isDuplicate) {
            res.json({
              success: false,
              message: 'Event code already redeemed by the user.'
            });
          } else {

            Code.findOne({
              _id: req.body.eventId
            }).select().exec(function(err, code) {
              console.log(code);
              console.log(user);

              User.findOneAndUpdate({
                username: user.username
              }, {
                $push: {
                  events: {
                    _id: code._id
                  }
                },
                $inc: {
                  points: code.points
                }
              }, function(err, newUser) {
                if (err) throw err;

                if (!newUser) {
                  res.json({
                    success: false,
                    message: "Unable to add event to user"
                  });
                } else {
                  res.json({
                    success: true,
                    message: "Points added to user"
                  });
                }
              });
            });
          }
        }

      });
    }
  });

  // ENDPOINT TO RETRIEVE TABLE WITH COUNT OF MEMBER MAJORS
  router.get('/getmembermajorstat', function(req, res) {
    User.aggregate([{
        $group: {
          _id: '$major',
          count: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          count: -1
        }
      }
    ], function(err, result) {
      if (err) throw err;

      res.json({
        success: true,
        message: result
      });
    });
  });

  // ENDPOINT TO RETRIEVE TABLE WITH COUNT OF MEMBER YEARS
  router.get('/getmemberyearstat', function(req, res) {
    User.aggregate([{
      $group: {
        _id: '$year',
        count: {
          $sum: 1
        }
      }
    },
    {
      $sort: {
        count: -1
      }
    }], function(err, result) {
      if (err) throw err;

      res.json({
        success: true,
        message: result
      });
    });
  });

  // ENDPOINT TO RETRIEVE TABLE WITH COUNT OF MEMBER NATIONALITIES
  router.get('/getmembernationalitystat', function(req, res) {
    User.aggregate([{
      $group: {
        _id: '$nationality',
        count: {
          $sum: 1
        }
      }
    },
    {
      $sort: {
        count: -1
      }
    }], function(err, result) {
      if (err) throw err;

      res.json({
        success: true,
        message: result
      });
    });
  });

  // ENDPOINT TO RETRIEVE TABLE WITH COUNT OF MEMBER SEXES
  router.get('/getmembersexstat', function(req, res) {
    User.aggregate([{
      $group: {
        _id: '$sex',
        count: {
          $sum: 1
        }
      }
    },
    {
      $sort: {
        count: -1
      }
    }], function(err, result) {
      if (err) throw err;

      res.json({
        success: true,
        message: result
      });
    });
  });

  // ENDPOINT TO RETRIEVE TABLE WITH COUNT OF MEMBER ETHNICITIES
  router.get('/getmemberethnicitystat', function(req, res) {
    User.aggregate([{
      $group: {
        _id: '$ethnicity',
        count: {
          $sum: 1
        }
      }
    },
    {
      $sort: {
        count: -1
      }
    }], function(err, result) {
      if (err) throw err;

      res.json({
        success: true,
        message: result
      });
    });
  });

  // ENDPOINT TO RETRIEVE ALUMNI COLLECTION
  router.get('/getalumni', function(req, res) {
    Alumni.find({

    }, function(err, alumni) {
      if (err) throw err;

      res.json({
        message: alumni,
        success: true
      });
    });
  });

  return router;
};
