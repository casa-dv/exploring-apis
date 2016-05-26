var defaults = {
	stop_id: "490G00005678" // Covent Garden Market East Side
	// search using https://api.tfl.gov.uk/StopPoint/Search/{common_name}?modes=bus
};
var base_url = "http://casa-dv.made-by-tom.co.uk/tfl/";

function fetch_stop_details(id){
	var url = base_url+"StopPoint/"+id;

	$.fetch(url, {
		responseType: "json"
	}).then(function(xhr) {
		var stop = xhr.response;
		$(".lat").textContent = stop.lat;
		$(".lng").textContent = stop.lon;

		fetch_nearby(stop.lat,stop.lon,300);

		$(".name").textContent = stop.commonName;

		var busLines = get_lines_from_stop_details(stop);

		$(".lines").innerHTML = "";
		if(busLines){
			$(".lines")._.contents(busLines.map(function(line){
				return $.create("li",{
					contents: line
				});
			}));
		}
	}).catch(function(error) {
		console.log(error);
	});
}

function get_lines_from_stop_details(stop){
	for (var i = 0; i < stop.lineModeGroups.length; i++) {
		if (stop.lineModeGroups[i].modeName === "bus"){
			return stop.lineModeGroups[i].lineIdentifier;
		}
	}
	return undefined;
}

function fetch_arrivals(id){
	var url = base_url + "StopPoint/"+id+"/Arrivals";
	$.fetch(url,{
		responseType: "json"
	}).then(function(xhr){
		var arrivals = xhr.response;
		$(".arrivals").innerHTML = "";
		if(arrivals && arrivals.length){
			// TODO
		} else {
			$(".arrivals")._.contents($.create("li",{
				contents: "No arrivals predicted."
			}));
		}
	});
}

function fetch_nearby(lat,lon,radius){
	var url = base_url + "Place?lat="+lat+"&lon="+lon+"&radius="+radius;
	$.fetch(url,{
		responseType: "json"
	}).then(function(xhr){
		var places = xhr.response.places;
		$(".places").innerHTML = "";
		$(".places")._.contents(places.map(function(place){
			return $.create("li",{
				contents: [
					place.placeType,
					place.commonName,
					["(",place.lat,",",place.lon,")"].join("")
					// place.additionProperties are object with key and value
					// eg for BikePoint, bikes available; JamCam, video URL
				].join(", ")
			});
		}));
	});
}

function init(){
	$(".stop_id").textContent = defaults.stop_id;
	fetch_stop_details(defaults.stop_id);
	fetch_arrivals(defaults.stop_id);
}

init();