// Create a map object
var myMap = L.map("mapid", {
  center: [29, -100],
  zoom: 4.2,
  style: 'mapbox://styles/mapbox/satellite-v9'
});


var lightLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/satellite-v9",
  accessToken: API_KEY
}).addTo(myMap);

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url, function(response) {

  // Create a new marker cluster group
  var quakes = response.features;
  console.log(quakes);
  // Loop through data
  for (var i = 0; i < quakes.length; i++) {

    // Conditionals for earthquake data
    var quake = quakes[i];

    var color = "";

    if (quakes[i].geometry.coordinates[2]  > 90) {
      color = "#990000";
    }
    else if (quakes[i].geometry.coordinates[2]  > 70) {
      color = "#FF6666";
    }
    else if (quakes[i].geometry.coordinates[2]  > 50) {
      color = "#FFB266";
    }
    else if (quakes[i].geometry.coordinates[2]  > 30) {
      color = "#FFFF66";
    }
    else if (quakes[i].geometry.coordinates[2]  > 10) {
      color = "#B2FF66";
    }
    else {
      color = "#66FF66";
    }
  

    // Check for location property
    if (quake) {

      // Add circles to map
      L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
          fillOpacity: 0.75,
          stroke: true,
          weight: 1,
          color: "black",
          fillColor: color,
          // Adjust radius
          radius: quake.properties.mag * 20000
        }).bindPopup("<h3>Location: " + quake.properties.place + "<h3><h3>Magnitude: " + quake.properties.mag + "</h3><h3>Depth (km): " + quake.geometry.coordinates[2] + "</h3>").addTo(myMap);

      }
  }

  // Set up the legend
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function(map) {
      var div = L.DomUtil.create("div", "legend");
      div.innerHTML += "<h4>Earthquake Depth (km)</h4>";
      div.innerHTML += '<i style="background: #66FF66"></i><span>Less Than 10</span><br>';
      div.innerHTML += '<i style="background: #B2FF66"></i><span>10 to 30</span><br>';
      div.innerHTML += '<i style="background: #FFFF66"></i><span>30 to 50</span><br>';
      div.innerHTML += '<i style="background: #FFB266"></i><span>50 to 70</span><br>';
      div.innerHTML += '<i style="background: #FF6666"></i><span>70 to 90</span><br>';
      div.innerHTML += '<i style="background: #990000"></i><span>Greater Than 90</span><br>';
      return div;
    };

    legend.addTo(myMap);
  
});
  