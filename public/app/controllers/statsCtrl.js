angular.module('statsController', [])
  .controller('statsCtrl', function(User) {
    var app = this;

    app.showMajor = false;
    app.showYear = false;
    app.showNationality = false;
    app.showSex = false;
    app.showEthnicity = false;
    app.majorArray = [];
    app.yearArray = [];
    app.nationalityArray = [];
    app.sexArray = [];
    app.ethnicityArray = [];

    User.getMemberMajorStat().then(function(data) {

      app.majorArray = data.data.message;

      var majorData = [];
      var total = 0;

      for (var i = 0; i < app.majorArray.length; i++) {
        majorData.push({
          name: app.majorArray[i]._id,
          y: app.majorArray[i].count
        });

        total = total + app.majorArray[i].count;
      }

      for (var i = 0; i < app.majorArray.length; i++) {
        app.majorArray[i].percentage = Number((app.majorArray[i].count / total) * 100).toFixed(2);
      }

      Highcharts.chart('majorStat', {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: ''
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false
            }
          }
        },
        series: [{
          name: 'Brands',
          colorByPoint: true,
          data: majorData
        }]
      });
    });

    User.getMemberYearStat().then(function(data) {

      app.yearArray = data.data.message;

      var labels = [];
      var labelsData = [];
      var colors = [];

      var total = 0;

      for (var i = 0; i < app.yearArray.length; i++) {
        labels.push(app.yearArray[i]._id);
        labelsData.push(app.yearArray[i].count);

        total = total + app.yearArray[i].count;
      }

      for (var i = 0; i < app.yearArray.length; i++) {
        app.yearArray[i].percentage = Number((app.yearArray[i].count / total) * 100).toFixed(2);
      }

      while (colors.length < app.yearArray.length) {
        do {
          var color = Math.floor((Math.random() * 1000000) + 1);
        } while (colors.indexOf(color) >= 0);
        colors.push("#" + ("000000" + color.toString(16)).slice(-6));
      }

      var ctx = document.getElementById("yearChart").getContext('2d');
      var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: labelsData,
            backgroundColor: colors
          }],
          labels: labels
        },
        options: {
          responsive: true,
          legend: {
            position: 'bottom',
          },
          animation: {
            animateScale: true,
            animateRotate: true
          }
        }
      });
    });

    User.getMemberNationalityStat().then(function(data) {
      app.nationalityArray = data.data.message;
      var labels = [];
      var labelsData = [];
      var colors = [];

      var total = 0;

      for (var i = 0; i < app.nationalityArray.length; i++) {
        labels.push(app.nationalityArray[i]._id);
        labelsData.push(app.nationalityArray[i].count);

        total = total + app.nationalityArray[i].count;
      }

      for (var i = 0; i < app.nationalityArray.length; i++) {
        app.nationalityArray[i].percentage = Number((app.nationalityArray[i].count / total) * 100).toFixed(2);
      }

      while (colors.length < app.nationalityArray.length) {
        do {
          var color = Math.floor((Math.random() * 1000000) + 1);
        } while (colors.indexOf(color) >= 0);
        colors.push("#" + ("000000" + color.toString(16)).slice(-6));
      }

      var ctx = document.getElementById("nationalityChart").getContext('2d');
      var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: labelsData,
            backgroundColor: colors
          }],
          labels: labels
        },
        options: {
          responsive: true,
          legend: {
            position: 'bottom',
          },
          animation: {
            animateScale: true,
            animateRotate: true
          }
        }
      });
    });

    User.getMemberSexStat().then(function(data) {
      app.sexArray = data.data.message;
      var labels = [];
      var labelsData = [];
      var colors = [];

      var total = 0;

      for (var i = 0; i < app.sexArray.length; i++) {
        labels.push(app.sexArray[i]._id);
        labelsData.push(app.sexArray[i].count);

        total = total + app.sexArray[i].count;
      }

      for (var i = 0; i < app.sexArray.length; i++) {
        app.sexArray[i].percentage = Number((app.sexArray[i].count / total) * 100).toFixed(2);
      }

      while (colors.length < app.sexArray.length) {
        do {
          var color = Math.floor((Math.random() * 1000000) + 1);
        } while (colors.indexOf(color) >= 0);
        colors.push("#" + ("000000" + color.toString(16)).slice(-6));
      }

      var ctx = document.getElementById("sexChart").getContext('2d');
      var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: labelsData,
            backgroundColor: colors
          }],
          labels: labels
        },
        options: {
          responsive: true,
          legend: {
            position: 'bottom',
          },
          animation: {
            animateScale: true,
            animateRotate: true
          }
        }
      });
    });

    User.getMemberEthnicityStat().then(function(data) {
      app.ethnicityArray = data.data.message;
      var labels = [];
      var labelsData = [];
      var colors = [];

      var total = 0;

      for (var i = 0; i < app.ethnicityArray.length; i++) {
        labels.push(app.ethnicityArray[i]._id);
        labelsData.push(app.ethnicityArray[i].count);

        total = total + app.ethnicityArray[i].count;
      }

      for (var i = 0; i < app.ethnicityArray.length; i++) {
        app.ethnicityArray[i].percentage = Number((app.ethnicityArray[i].count / total) * 100).toFixed(2);
      }

      while (colors.length < app.ethnicityArray.length) {
        do {
          var color = Math.floor((Math.random() * 1000000) + 1);
        } while (colors.indexOf(color) >= 0);
        colors.push("#" + ("000000" + color.toString(16)).slice(-6));
      }

      var ctx = document.getElementById("ethnicityChart").getContext('2d');
      var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: labelsData,
            backgroundColor: colors
          }],
          labels: labels
        },
        options: {
          responsive: true,
          legend: {
            position: 'bottom',
          },
          animation: {
            animateScale: true,
            animateRotate: true
          }
        }
      });
    });
  });
