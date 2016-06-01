var api_key = 'de882c8150f854766bbeb4388c25881d';
var lat = '51.2';
var lon = '-0.1';

var map = L.map('map').setView([lat,lon],17);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
function loadPhotos(){
$.getJSON(
  [
    'https://api.flickr.com/services/rest/?',
    'method=flickr.photos.search',
    '&format=json',
    '&api_key=', api_key,
    '&lat=', lat,
    '&lon=', lon,
    '&extras=geo,url_t,url_m,url_sq',
    '&radius=0.3',
    '&per_page=20',
    '&jsoncallback=?'
  ].join(""), function(data){
      if(data && data.stat == "ok" && data.photos && data.photos.photo.length){
          displayPhotos(data.photos.photo);
      }
});
}

function displayPhotos(photos){
    var photo;
    console.log(photos);
    for(var i = 0; i < photos.length; i++){
        photo = photos[i];
        html = [
            '<a href="',
            'https://www.flickr.com/photos/', photo.owner, '/', photo.id,
            '" target = "_blank">',
            '<img src="'+photo.url_sq+'" alt="'+photo.title+'" width="',photo.width_sq,'" height="',photo.height_sq,'"/>',
            '</a>'
        ].join("");
        L.marker([photo.latitude, photo.longitude]).addTo(map)
            .bindPopup(html);
    }
}

loadPhotos();
map.on('moveend',function(){
    var center = map.getCenter();
    lat = center.lat;
    lon = center.lng;
    loadPhotos();
})
