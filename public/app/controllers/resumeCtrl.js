angular.module('resumeController', ['authServices'])

.controller('resumeCtrl', function($scope, Auth, fileUploadService){
  $scope.onFileSelect = function(image) {
    $scope.uploadInProgress = true;
    $scope.uploadProgress = 0;

    if (angular.isArray(image)) {
      image = image[0];
    }

    $scope.upload = $upload.upload({
      url: '/api/upload/resume',
      method: 'POST',
      file: image
    }).progress(function(event) {
      $scope.uploadProgress = Math.floor(event.loaded / event.total);
      $scope.$apply();
    }).success(function(data, status, headers, config) {
      AlertService.success('Photo uploaded!');
    }).error(function(err) {
      $scope.uploadInProgress = false;
      AlertService.error('Error uploading file: ' + err.message || err);
    });

  });
}
