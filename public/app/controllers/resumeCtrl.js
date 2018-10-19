angular.module('resumeController', ['authServices'])

  .directive('demoFileModel', function($parse) {
    return {
      restrict: 'A', //the directive can be used as an attribute only

      /*
       link is a function that defines functionality of directive
       scope: scope associated with the element
       element: element on which this directive used
       attrs: key value pair of element attributes
       */
      link: function(scope, element, attrs) {
        var model = $parse(attrs.demoFileModel),
          modelSetter = model.assign; //define a setter for demoFileModel

        //Bind change event on the element
        element.bind('change', function() {
          //Call apply on scope, it checks for value changes and reflect them on UI
          scope.$apply(function() {
            //set the model value
            modelSetter(scope, element[0].files[0]);
          });
        });
      }
    };
  })

  .service('fileUploadService', function($http, $q) {

    this.uploadFileToUrl = function(file, uploadUrl) {
      //FormData, object of key/value pair for form fields and values
      var fileFormData = new FormData();
      fileFormData.append('test', file);
      //console.log("FileData in service: " + file.name);
      // for (var value of fileFormData.values()) {
      //   console.log(value);
      // }
      var deffered = $q.defer();
      $http.post(uploadUrl, fileFormData, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      }).success(function(response) {
        deffered.resolve(response);

      }).error(function(response) {
        deffered.reject(response);
      });

      return deffered.promise;
    }
  })

.controller('resumeCtrl', function($scope, Auth, fileUploadService) {


  $scope.$on('$viewContentLoaded', function() {
    Auth.getUser().then(function(data) {
      //console.log(data.data);
      var iframe = document.getElementById('myResume');
      iframe.src = "https://drive.google.com/file/d/" + data.data.ResumeID + "/preview";
    });
  });

  $scope.uploadFile = function(username) {
    //console.log(username);
    var file = $scope.myFile;
    //console.log("FileData in controller: " + file.name + file.type + file.size);
    var uploadUrl = "api/uploadResume/" + username, //Url of webservice/api/server
      promise = fileUploadService.uploadFileToUrl(file, uploadUrl);

    promise.then(function(response) {
      $scope.serverResponse = response;
    }, function() {
      $scope.serverResponse = 'An error has occurred';
    })
  };



})
