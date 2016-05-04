/**
 * Map setup
 */
var defaults = {
  lat: 51.4987,
  lng: -0.0618,
  zoom: 11
};

var options = update_options_from_hash(defaults);
var map = L.map('map').setView([options.lat, options.lng], options.zoom);
map.on('zoomend, moveend', set_location_hash);

var access_token = 'pk.eyJ1IjoidG9tYWxydXNzZWxsIiwiYSI6Im9TM1lfSWsifQ.0dE4yPsqc7HJbBT22ceU5g';
var mapbox_style = 'mapbox.satellite';
var tile_url = 'https://{s}.tiles.mapbox.com/v4/' + mapbox_style + '/{z}/{x}/{y}.png?access_token=' + access_token;

L.tileLayer(tile_url, {
    attribution: 'Imagery &copy; <a href="//mapbox.com">Mapbox</a>',
    maxZoom: 17
}).addTo(map);

d3.json('./tfl-bus-stops.json', function(response){
  L.geoJson(response).addTo(map);
});

function point_style(feature) {
  return {
    fillColor: 'transparent',
    weight: 2,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.7
  };
}

function set_location_hash(){
  var centre = map.getCenter();
  window.location.hash = 'zoom=' + map.getZoom() + '&lng=' + centre.lng.toFixed(4) + '&lat=' + centre.lat.toFixed(4);
}

function update_options_from_hash(options){
  var hash = window.location.hash;
  if (hash.length){
    var elements = hash.substring(1).split('&');
    for (var i = 0; i < elements.length; i++) {
      var pair = elements[i].split('=');
      options[pair[0]] = pair[1];
    }
  }
  return options;
}
