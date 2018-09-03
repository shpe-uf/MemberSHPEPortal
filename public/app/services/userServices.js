angular.module('userServices', [])

  .factory('User', function($http) {
    var userFactory = {};

    // CREATE/REGISTER USERS
    userFactory.create = function(regData) {
      return $http.post('/api/users', regData);
    };

    // CREATE EVENT CODES
    userFactory.createCode = function(eventData) {
      return $http.post('api/codes/', eventData);
    };

    // FORGOT USERNAME
    userFactory.sendUsername = function(userData) {
      return $http.get('/api/forgetusername/' + userData);
    };

    // SEND PASSWORD RESET EMAIL
    userFactory.sendPassword = function(resetData) {
      return $http.put('/api/resetpassword', resetData);
    };

    // PASSWORD RESET
    userFactory.resetPassword = function(token) {
      return $http.get('/api/resetpassword/' + token);
    };

    // SAVE PASSWORD
    userFactory.savePassword = function(regData) {
      return $http.put('/api/savepassword/', regData);
    };

    // RENEW USER TOKEN
    // userFactory.renewSession = function(username) {
    //   return $http.get('/api/renewtoken/' + username);
    // };

    // DETERMINE USER PERMISSION
    userFactory.getPermission = function() {
      return $http.get('/api/permission/');
    };

    // RETRIEVE ALL USERS
    userFactory.getUsers = function() {
      return $http.get('api/admin/');
    };

    // RETRIEVE ALL EVENT CODES
    userFactory.getCodes = function() {
      return $http.get('api/getcodes/');
    };

    // ADD A NEW REQUEST TO THE USER
    userFactory.addRequest = function(requestData) {
      return $http.put('api/addrequest/', requestData);
    };

    // GRAB EVENT CODE INFORMATION FOR INDIVIDUAL USERS
    userFactory.getCodeInfo = function(codeData) {
      return $http.get('api/getcodeinfo/' + codeData._id);
    };

    // GRAB ALL THE REQUESTS
    userFactory.getRequests = function() {
      return $http.get('api/getrequests/');
    };
    
    return userFactory;
  });
