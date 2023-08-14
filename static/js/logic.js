//Store the API
//url for 7 days https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson   for faster load
//url for 30 days https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson for more data

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//perform a get request and load using d3

d3.json(url).then(function(data){
    //to check the data structure
    console.log(data.features)

    createFeatures(data.features);
});


// Defining the function for features
function createFeatures(earthquakeData){

    //Define a funciton to run for each features.
    // Giving each feature a popup,

    function onEachFeature(feature, layer){
      
      layer.bindPopup(`<h3>${feature.properties.place}' Mag:'${feature.properties.mag}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }
    
// Create a GeoJson layer. Using On each and Point to Layer

    let earthquakes = L.geoJSON(earthquakeData,{
    onEachFeature: onEachFeature,
    pointToLayer: createMarker
});
    createMap(earthquakes);
}

//marker style

function createMarker(feature, style){

    return L.circle(style,{

        radius :markersize(feature.properties.mag),
        fillcolor:markerColor(feature.geometry.coordinates[2]),
        color:markerColor(feature.geometry.coordinates[2]),
        stroke: true,
        weight: 3,
        opacity: 0.5,
        fillOpacity: 0.7

    });
}


function createMap(earthquakes){

    // Create base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      });
      
    // Create a baseMap object
    let baseMaps = {
        "Street Map": street,
        "Toto": topo,
         };

    
    // Crate overlay object to hold our overlay
    let overlayMaps = {
    Earthquakes: earthquakes      

    };

    // Create the map, giving it the streetmap and earthquake layers to display on default.
    let Map = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(Map);

// Create a legend to display information about our map.
    let info = L.control({
        position: "bottomright"
        });

// When the layer control is added, insert a div with the class of "legend".
    info.onAdd = function(Map) {
        let div = L.DomUtil.create("div", "legend"),
        labels = [],
        catergory = [-10,10,30,50,70,90],
        legendInfo = "<p>Depth</p>";


    for (let i = 0; i < catergory.length; i++) {
        div.innerHTML +=
            '<i style="background:' + markerColor(catergory[i] + 1) + '"></i> ' +
            catergory[i] + (catergory[i + 1] ? '&ndash;' + catergory[i + 1] + '<br>' : '+');
    }   

    return div;
   
  };

  info.addTo(Map);



}

//Market size

function markersize(magnitude){
    return magnitude * 5000;
}

function markerColor(depth) {
    return  depth> 90 ? '#1C0A00' :
            depth > 70 ? '#8E3200' :
            depth > 50 ? '#A64B2A' :
            depth > 30 ? '#D7A86E' :
            depth > 10 ? 'Green' :
                         '#4B8E8D' ;          
}

