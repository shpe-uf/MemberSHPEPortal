angular.module('alumniController', [])
  .controller('alumniCtrl', function(User) {
    var app = this;

    app.alumniArray = [];

    User.getAlumni().then(function(data) {
      app.alumniArray = data.data.message;
    });

    var map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([-98.5795, 39.8283]),
        zoom: 4.5
      })
    });

  });
