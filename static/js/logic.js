function createMap(earthquakes) {
  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

   // Create a baseMaps object to hold the lightmap layer
   var baseMaps = {
    "Light Map": lightmap
  };

  // Create an overlayMaps object to hold the bikeStations layer
  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create the map object with options
  var map = L.map("mapid", {
    center: [37.0902, -95.7129],
    zoom: 3,
    layers: [lightmap, earthquakes]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}

function createMarkers(response) {

    // Pull the "stations" property off of response.data
    var quakes = response.features;
    // Initialize an array to hold bike markers
    var quakeMarkers = [];
  
    // Loop through the stations array
    for (var index = 0; index < quakes.length; index++) {
      var quake = quakes[index];
  
      // For each station, create a marker and bind a popup with the station's name
      var earthquake = L.marker([quake.geometry.coordinates[1], quake.geometry.coordinates[0]])
        .bindPopup("<h3>" + quake.properties.title + "<h3><h3>Magnitude: " + quake.properties.mag + "</h3>");
  
      // Add the marker to the bikeMarkers array
      quakeMarkers.push(earthquake);
    }
  
    // Create a layer group made from the bike markers array, pass it into the createMap function
    createMap(L.layerGroup(quakeMarkers));
    console.log(quakeMarkers);
  }

  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);