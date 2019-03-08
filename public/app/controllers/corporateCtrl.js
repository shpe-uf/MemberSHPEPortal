angular.module('corporateController', [])
  .controller('corporateCtrl', function(User) {

    var app = this;

    this.openMoreInfoModal = function(companyId) {
      $("#moreInfoModal").modal({
        backdrop: 'static'
      });

      User.getCompanyInfo(companyId).then(function(data) {
        app.company = data.data.message;
        app.company.majorsList = "";
        app.company.industryList = "";

        for (var i = 0; i < app.company.majors.length; i++) {
          if (i === app.company.majors.length-1) {
            app.company.majorsList += app.company.majors[i];
          } else {
            app.company.majorsList += (app.company.majors[i] + ", ");
          }
        }

        for (var i = 0; i < app.company.industry.length; i++) {
          if (i === app.company.industry.length-1) {
            app.company.industryList += app.company.industry[i];
          } else {
            app.company.industryList += (app.company.industry[i] + ", ");
          }
        }
      });
    };

    this.closeMoreInfoModal = function() {
      $('#moreInfoModal').modal('hide');
    };

    User.getCompanies().then(function(data) {
      if (data.data.success) {
        app.companies = data.data.message;
      }
    });
  });
