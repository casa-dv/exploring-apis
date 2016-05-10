// see also: documentation for Google Places Javascript API
// https://developers.google.com/maps/documentation/javascript/examples/place-search

// global variables for convenience
// call init() first to set these up
// then they will be available in other functions
var map;
var service;
var infowindow;

function init(mapLocation) {
  // set up map
  map = new google.maps.Map(document.getElementById('map'), {
      center: mapLocation,
      zoom: 15
  });

  // set up popup window (to be shown when user clicks on a marker)
  infowindow = new google.maps.InfoWindow();

  // set up place API service
  service = new google.maps.places.PlacesService(map);
}

function getPlaces(location){
    // make API request
    var request = {
        location: location,
        radius: '500',
        types: ['cafe']
    };
    service.nearbySearch(request, placesCallback); // callback is called when API request is done
}

function placesCallback(results, status) {
  // Uncomment to see results of API call:
  // console.log(results);
  // console.log(status);

  if (status == google.maps.places.PlacesServiceStatus.OK) {
    // create a marker for each place returned
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}

function getDetails(placeId){
    service.getDetails(
      {
        placeId: placeId
      },
        // here the callback function is written inline - this is an 'anonymous' function because
        // it doesn't have a name. In other respects, it should work just the same as the function
        // called placesCallback that we used in the getPlaces API request
      function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            console.log(place);
        }
      }
    );
}


// call init to kick things off!
var center = new google.maps.LatLng(51.514756,-0.104345);
init(center);

// make places API request
getPlaces(center);

// test getting full place details - results should be console.logged out
placeId = 'ChIJ4VeOyLIEdkgRJDgEopNEcSA';
getDetails(placeId);
