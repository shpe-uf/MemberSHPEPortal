angular.module('alumniController', [])
  .controller('alumniCtrl', function(User) {
    var app = this;

    app.alumniArray = [];
    app.locations = [];

    User.getAlumni().then(function(data) {
      app.alumniArray = data.data.message;
    });

    User.getCityCoordinates().then(function(data) {
      app.locations = data.data.message;

      window.onload = function() {

        L.mapquest.key = '1tEn5h8WXS6UGGviUKM2COVxkm3r7TJQ';

        L.mapquest.geocoding().geocode(app.locations, createMap);

        function createMap(error, response) {
          var map = L.mapquest.map('map', {
            layers: L.mapquest.tileLayer('map'),
            center: [39.8283, -98.5795],
            zoom: 4.4
          });

          var featureGroup = generateMarkers(response, app.alumniArray);
          featureGroup.addTo(map);
        }

        function generateMarkers(response, alumniArray) {
          var group = [];

          console.log(alumniArray);

          for (var i = 0; i < response.results.length; i++) {
            var location = response.results[i].locations[0];
            var locationLatLng = location.latLng;

            // Create a marker for each location
            var marker = L.marker(locationLatLng, {
                icon: L.mapquest.icons.marker()
              })
              .bindPopup("<p>" + alumniArray[i].name + "</p>");

            group.push(marker);
          }
          return L.featureGroup(group);
        }
      }

    });

  });
