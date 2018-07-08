angular.module('userServices', [])

  .factory('User', function($http) {
    var userFactory = {};

    userFactory.create = function(regData) {
      return $http.post('/api/users', regData);
    };

    userFactory.sendUsername = function(userData) {
      return $http.get('/api/forgetusername/' + userData);
    };

    userFactory.sendPassword = function(resetData) {
      return $http.put('/api/resetpassword', resetData);
    };

    userFactory.resetUser = function(token) {
      return $http.get('/api/resetpassword/' + token);
    };

    userFactory.savePassword = function(regData) {
      return $http.put('/api/savepassword/', regData);
    };

    userFactory.renewSession = function(username) {
        console.log("USER SERVICES - RENEW SESSION");
        return $http.get('/api/renewtoken/' + username);
    };

    return userFactory;
  });
