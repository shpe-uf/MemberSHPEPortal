angular.module('resumeController', ['userServices'])
  .controller('resumeCtrl', function($scope, User) {

    var app = this;


    $scope.resumeFile = "";

    $scope.$on("fileProgress", function(e, progress) {
      $scope.progress = progress.loaded / progress.total;
    });

    this.openResumeModal = function() {
      app.fileErrorMsg = false;
      app.fileSuccessMsg = false;

      $("#resumeModal").modal({
        backdrop: 'static',
        keyboard: false
      });

    };

    this.closeResumeModal = function() {

      $('#resumeModal').modal('hide');

    };

    this.uploadResume = function(resumeFile) {
      console.log(resumeFile.file);
      var fileType = resumeFile.file.substring(0, 20).toLowerCase();

      if (fileType == 'data:application/pdf') {

        User.uploadResume(resumeFile.file);
      }
      else {
        app.fileErrorMsg = 'Please upload a file type PDF';
        app.fileSuccessMsg = false;
      }
    };



  })

  .directive('ngFileSelect', function(fileReader, $timeout) {
    return {
      scope: {
        ngModel: '='
      },
      link: function($scope, el) {
        function getFile(file) {
          fileReader.readAsDataUrl(file, $scope)
            .then(function(result) {
              $timeout(function() {
                $scope.ngModel = result;
              });
            });


        }

        el.bind("change", function(e) {
          var file = (e.srcElement || e.target).files[0];
          getFile(file);
        });
      }
    };
  })

  .factory('fileReader', function($q, $log) {
    var onLoad = function(reader, deferred, scope) {
      return function() {
        scope.$apply(function() {
          deferred.resolve(reader.result);
        });
      };
    };

    var onError = function(reader, deferred, scope) {
      return function() {
        scope.$apply(function() {
          deferred.reject(reader.result);
        });
      };
    };

    var onProgress = function(reader, scope) {
      return function(event) {
        scope.$broadcast("fileProgress", {
          total: event.total,
          loaded: event.loaded
        });
      };
    };

    var getReader = function(deferred, scope) {
      var reader = new FileReader();
      reader.onload = onLoad(reader, deferred, scope);
      reader.onerror = onError(reader, deferred, scope);
      reader.onprogress = onProgress(reader, scope);
      return reader;
    };

    var readAsDataURL = function(file, scope) {
      var deferred = $q.defer();

      var reader = getReader(deferred, scope);
      reader.readAsDataURL(file);

      return deferred.promise;
    };

    return {
      readAsDataUrl: readAsDataURL
    };
  });
