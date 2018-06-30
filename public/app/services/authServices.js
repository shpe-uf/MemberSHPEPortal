angular.module('authServices', [])

  .factory('Auth', function($http) {
    var authFactory = {};

    authFactory.login = function(authData) {
      return $http.post('/api/authenticate', authData);
    }

    return authFactory;
  });
