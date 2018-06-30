var User = require('../models/user');

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
    user.listServ = req.body.listServ;

    if (req.body.username == null || req.body.password == null || req.body.email == null || req.body.firstName == null || req.body.lastName == null || req.body.major == null || req.body.year == null || req.body.username == '' || req.body.password == '' || req.body.email == '' || req.body.firstName == '' || req.body.lastName == '' || req.body.major == '' || req.body.year == '') {
      res.send('Make sure you filled out the entire form!')
    } else {
      user.save(function(err) {
        if (err) {
          res.send('User already exists!');
        } else {
          res.send("\nUser created");
        }
      });
    }
  });

  return router;
}
