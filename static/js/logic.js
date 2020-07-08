// Creating map object


// Adding tile layer
var baseLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  transparency: 'true',
  id: "mapbox/dark-v10",
  accessToken: API_KEY
});


var tick_data = data[0];
var lyme_data = data[1];

// console.log(tick_data);
//console.log(lyme_data);

var stateBoundary;
//var geoData = "static/data/gz_2010_us_040_00_20m.geojson";
var geoData = "static/Resources/geoData/gz_2010_us_040_00_20m.geojson";
d3.json(geoData, function (data) {
  stateBoundary = L.geoJSON(data.features, {
    style: { color: "#fff", fillOpacity: 0.0 }
  });
});

var countyBoundary;
//var geoData = "static/data/gz_2010_us_050_00_20m.geojson";
var geoData = "static/Resources/geoData/gz_2010_us_050_00_20m.geojson";
d3.json(geoData, function (data) {
  countyBoundary = L.geoJSON(data.features, {
    style: { color: "#fff", weight: 0.5, fillOpacity: 0.0 }
  });
});
// Load in geojson data
var geoData = "static/Resources/geoData/gz_2010_us_050_00_20m.geojson";
var locations = [];

d3.json(geoData, function (data) {
  var fip;
  var county = "";
  var maxCount = 0;
  for (var i = 0; i < data.features.length; i++) {
    county = "00" + parseInt(data.features[i].properties.COUNTY);
    fip = parseInt(data.features[i].properties.STATE) + county.substring(county.length - 3, county.length);
    for (var j = 0; j < tick_data.loc.length; j++) {
      if (tick_data.loc[j][0] == fip) {
        data.features[i].properties.TICKSTATUS = tick_data.loc[j][1];
        if (tick_data.loc[j][1] == "No records") {
          data.features[i].properties.TICKCODE = 0;
        }
        else {
          if (tick_data.loc[j][1] == "Reported") {
            data.features[i].properties.TICKCODE = 1;
          }
          else {
            data.features[i].properties.TICKCODE = 2;
          }
        }
        break;
      }
    }


    fip = parseInt(data.features[i].properties.STATE) + data.features[i].properties.COUNTY;
    for (var j = 0; j < lyme_data.loc.length; j++) {
      if (lyme_data.loc[j][0] == fip) {
        data.features[i].properties.LYME_CASES = lyme_data.loc[j][1];
        if (parseInt(lyme_data.loc[j][1]) > parseInt(maxCount)) {
          maxCount = parseInt(lyme_data.loc[j][1])
        }
        break;
      }
    }
    var location = {};
    if (data.features[i].geometry.type === "Polygon") {
      location.lat = data.features[i].geometry.coordinates[0][0][1];
      location.lng = data.features[i].geometry.coordinates[0][0][0];
    }
    else {
      location.lat = data.features[i].geometry.coordinates[0][0][0][1];
      location.lng = data.features[i].geometry.coordinates[0][0][0][0];
    }
    location.count = parseInt(data.features[i].properties.LYME_CASES);
    locations.push(location);

  }
  var heatdata = {
    max: maxCount,
    data: locations
  };
  //console.log(heatdata);

  var geojson;

  // Create a new choropleth layer
  geojson = L.choropleth(data, {

    // Define what  property in the features to use
    valueProperty: "TICKCODE",

    // Set color scale
    scale: ["#ffffb2", "#b10026"],
    // Number of breaks in step range
    steps: 3,

    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.7
    },

    //Binding a pop-up to each layer
    onEachFeature: function (feature, layer) {
      layer.bindPopup("County: " + feature.properties.NAME + "<br>Tick Status: " +
        feature.properties.TICKSTATUS + "<br>Lyme Cases: " + feature.properties.LYME_CASES);
    }
  });


  var cfg = {
    // radius should be small ONLY if scaleRadius is true (or small radius is intended)
    // if scaleRadius is false it will be the constant radius used in pixels
    "radius": 3,
    "maxOpacity": .8,
    // scales the radius based on map zoom
    "scaleRadius": true,
    // if set to false the heatmap uses the global maximum for colorization
    // if activated: uses the data maximum within the current map boundaries
    //   (there will always be a red spot with useLocalExtremas true)
    "useLocalExtrema": false,
    // which field name in your data represents the latitude - default "lat"
    latField: 'lat',
    // which field name in your data represents the longitude - default "lng"
    lngField: 'lng',
    // which field name in your data represents the data value - default "value"
    valueField: 'count'
  };


  var heatmapLayer = new HeatmapOverlay(cfg);
  var myMap = L.map("map", {
    center: [40.0522, -95.8437],
    zoom: 4,
    layers: [baseLayer, stateBoundary, countyBoundary, geojson]
  });

  heatmapLayer.setData(heatdata);

  var overlays = {
    "Tick Presence": geojson,
    "Lyme Cases": heatmapLayer
  };

  // Create a control for our layers, add our overlay layers to it
  L.control.layers(overlays, null, { collapsed: false }).addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h5>Tick Presence</h5>" //+
    //   "<div class=\"labels\">" +
    //   "<div class=\"min\">No records</div>" +
    //   "<div class=\"max\">Established</div>" +
    //   "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function (limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul><center>" + labels.join("") + "</center></ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);

  //myMap.invalidateSize();
  window.setTimeout(function() {
        myMap.invalidateSize();
    }, 2000);
});
