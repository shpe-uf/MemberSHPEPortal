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

      var labels = [];
      var labelsData = [];
      var total = 0;

      for (var i = 0; i < app.majorArray.length; i++) {
        labels.push(app.majorArray[i]._id);
        labelsData.push(app.majorArray[i].count);

        total = total + app.majorArray[i].count;
      }

      for (var i = 0; i < app.majorArray.length; i++) {
        app.majorArray[i].percentage = Number((app.majorArray[i].count / total) * 100).toFixed(2);
      }

      var colors = palette('tol-rainbow', app.majorArray.length);

      for (var i = 0; i < colors.length; i++) {
        var hashtag = '#';
        colors[i] = hashtag.concat(colors[i]);
      }

      var donutOptions = {
        cutoutPercentage: 85,
        legend: {
          position: 'bottom',
          padding: 5,
          labels: {
            pointStyle: 'circle',
            usePointStyle: true
          }
        }
      };

      var chartData = {
        labels: labels,
        datasets: [{
          backgroundColor: colors,
          borderWidth: 0,
          data: labelsData
        }]
      };

      var majorChart = document.getElementById("majorChart");
      if (majorChart) {
        new Chart(majorChart, {
          type: 'pie',
          data: chartData,
          options: donutOptions
        });
      }
    });

    User.getMemberYearStat().then(function(data) {

      app.yearArray = data.data.message;

      var labels = [];
      var labelsData = [];
      var total = 0;

      for (var i = 0; i < app.yearArray.length; i++) {
        labels.push(app.yearArray[i]._id);
        labelsData.push(app.yearArray[i].count);

        total = total + app.yearArray[i].count;
      }

      for (var i = 0; i < app.yearArray.length; i++) {
        app.yearArray[i].percentage = Number((app.yearArray[i].count / total) * 100).toFixed(2);
      }

      var colors = palette('tol-rainbow', app.yearArray.length);

      for (var i = 0; i < colors.length; i++) {
        var hashtag = '#';
        colors[i] = hashtag.concat(colors[i]);
      }

      var donutOptions = {
        cutoutPercentage: 85,
        legend: {
          position: 'bottom',
          padding: 5,
          labels: {
            pointStyle: 'circle',
            usePointStyle: true
          }
        }
      };

      var chartData = {
        labels: labels,
        datasets: [{
          backgroundColor: colors,
          borderWidth: 0,
          data: labelsData
        }]
      };

      var yearChart = document.getElementById("yearChart");
      if (yearChart) {
        new Chart(yearChart, {
          type: 'pie',
          data: chartData,
          options: donutOptions
        });
      }
    });

    User.getMemberNationalityStat().then(function(data) {
      app.nationalityArray = data.data.message;
      var labels = [];
      var labelsData = [];
      var total = 0;

      for (var i = 0; i < app.nationalityArray.length; i++) {
        labels.push(app.nationalityArray[i]._id);
        labelsData.push(app.nationalityArray[i].count);

        total = total + app.nationalityArray[i].count;
      }

      for (var i = 0; i < app.nationalityArray.length; i++) {
        app.nationalityArray[i].percentage = Number((app.nationalityArray[i].count / total) * 100).toFixed(2);
      }

      var colors = palette('tol-rainbow', app.nationalityArray.length);

      for (var i = 0; i < colors.length; i++) {
        var hashtag = '#';
        colors[i] = hashtag.concat(colors[i]);
      }

      var donutOptions = {
        cutoutPercentage: 85,
        legend: {
          position: 'bottom',
          padding: 5,
          labels: {
            pointStyle: 'circle',
            usePointStyle: true
          }
        }
      };

      var chartData = {
        labels: labels,
        datasets: [{
          backgroundColor: colors,
          borderWidth: 0,
          data: labelsData
        }]
      };

      var nationalityChart = document.getElementById("nationalityChart");
      if (nationalityChart) {
        new Chart(nationalityChart, {
          type: 'pie',
          data: chartData,
          options: donutOptions
        });
      }
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

      var colors = palette('tol-rainbow', app.sexArray.length);

      for (var i = 0; i < colors.length; i++) {
        var hashtag = '#';
        colors[i] = hashtag.concat(colors[i]);
      }

      var donutOptions = {
        cutoutPercentage: 85,
        legend: {
          position: 'bottom',
          padding: 5,
          labels: {
            pointStyle: 'circle',
            usePointStyle: true
          }
        }
      };

      var chartData = {
        labels: labels,
        datasets: [{
          backgroundColor: colors,
          borderWidth: 0,
          data: labelsData
        }]
      };

      var sexChart = document.getElementById("sexChart");
      if (sexChart) {
        new Chart(sexChart, {
          type: 'pie',
          data: chartData,
          options: donutOptions
        });
      }
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

      var colors = palette('tol-rainbow', app.ethnicityArray.length);

      for (var i = 0; i < colors.length; i++) {
        var hashtag = '#';
        colors[i] = hashtag.concat(colors[i]);
      }

      var donutOptions = {
        cutoutPercentage: 85,
        legend: {
          position: 'bottom',
          padding: 5,
          labels: {
            pointStyle: 'circle',
            usePointStyle: true
          }
        }
      };

      var chartData = {
        labels: labels,
        datasets: [{
          backgroundColor: colors,
          borderWidth: 0,
          data: labelsData
        }]
      };

      var ethnicityChart = document.getElementById("ethnicityChart");
      if (ethnicityChart) {
        new Chart(ethnicityChart, {
          type: 'pie',
          data: chartData,
          options: donutOptions
        });
      }
    });
  });
