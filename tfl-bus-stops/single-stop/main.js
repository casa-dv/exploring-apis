var options = {
	// stop_id: "490015764E1" // Covent Garden / Russell Street
	stop_id: "490015764C", // Covent Garden / Catherine Street
	line_id: "rv1"
};
var base_url = "http://casa-dv.made-by-tom.co.uk/tfl/";

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


function fetch_stop_details(id){
	var url = base_url+"StopPoint/"+id;

	$.fetch(url, {
		responseType: "json"
	}).then(function(xhr) {
		var stop = xhr.response;

		stop = parse_stop(id,stop);

		$(".lat").textContent = stop.lat;
		$(".lng").textContent = stop.lon;

		fetch_nearby(stop.lat,stop.lon,200);

		$(".name").textContent = stop.commonName;

		var busLines = get_lines_from_stop_details(stop);

		$(".lines").innerHTML = "";
		if(busLines){
			$(".lines")._.contents(busLines.map(function(line){
				var span = $.create("span",{
					contents: "[stopId]"
				});
				span.setAttribute("class","nextStop-"+line);
				var li = $.create("li",{
					contents: line + " - next stop: "
				});
				li.appendChild(span);

				return li;
			}));

			busLines.forEach(function(line){
				if(line == options.line_id){
					fetch_timetable(line,options.stop_id);
				} else {
					$(".nextStop-"+line).appendChild(id_link(options.stop_id, line));
				}
			});
		}

	}).catch(function(error) {
		console.log(error);
	});
}

function parse_stop(id,stop){
	if(stop.id == id){
		return stop;
	}
	if(stop.children){
		for (var i = 0; i < stop.children.length; i++) {
			var found = parse_stop(id,stop.children[i]);
			if(found){
				return found;
			}
		}
	}
	return undefined;
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
			$(".arrivals")._.contents(arrivals.map(function(arrival){
			return $.create("li",{
				contents: [
					moment(arrival.expectedArrival).fromNow(),
					arrival.lineName,
					arrival.expectedArrival
				].join(", ")
			});
			}));
		} else {
			$(".arrivals")._.contents($.create("li",{
				contents: "No arrivals expected in the next 30 minutes. Please see timetable."
			}));
		}
	}).catch(function(error) {
		console.log(error);
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
			var li = $.create("li",{
				contents: [
					place.placeType,
					place.commonName,
					["(",place.lat,",",place.lon,")"].join("")
					// TODO filter by placeType
					// TODO add/save bike data, tube lines
					// place.additionProperties are object with key and value
					// eg for BikePoint, bikes available; JamCam, video URL
				].join(", ")
			});
			if(place.placeType == "StopPoint"){
				li.appendChild(id_link(place.id, options.line_id));
			}
			return li;
		}));
	}).catch(function(error) {
		console.log(error);
	});
}

function id_link(stop,line){
	var a = document.createElement("a");
	var href = "#stop_id="+stop +"&line_id="+line;
	a.setAttribute("href",href);
	if(stop == options.stop_id){
		a.textContent = "Change to route " + line;
	} else {
		a.textContent = "Go to stop #" + stop;
	}
	return a;
}

function fetch_timetable(line,stop){
	fetch_timetable_in_direction(line,stop,"inbound");
	// fetch_timetable_in_direction(line,stop,"outbound");
}
function fetch_timetable_in_direction(line,stop,direction){
	var url = base_url + "/Line/"+line+"/Timetable/"+stop+"?direction="+direction;
	$.fetch(url,{
		responseType: "json"
	}).then(function(xhr){
		var timetable = xhr.response.timetable;
		window.timetable = timetable;

		if (timetable &&
			timetable.routes &&
			timetable.routes.length	&&
			timetable.routes[0].stationIntervals &&
			timetable.routes[0].stationIntervals.length &&
			timetable.routes[0].stationIntervals[0].intervals &&
			timetable.routes[0].stationIntervals[0].intervals.length
		){
			$(".nextStop-"+line).textContent = "";
			$(".nextStop-"+line).appendChild(id_link(timetable.routes[0].stationIntervals[0].intervals[0].stopId, options.line_id));
		}

	}).catch(function(error) {
		console.log(error);
	});
}

function init(){
	// TODO clear old data, show loading
	update_options_from_hash(options);
	$(".stop_id").textContent = options.stop_id;
	fetch_stop_details(options.stop_id);
	fetch_arrivals(options.stop_id);
}

window.addEventListener("hashchange", function(e){
	var change = update_options_from_hash({});

	if(options.stop_id == change.stop_id && options.line_id != change.line_id){
		update_options_from_hash(options);
		fetch_timetable(change.line_id,change.stop_id);
		// TODO fix all hrefs to new line_id
	} else {
		// maybe TODO stash whole timetable
		// - then navigate along list of stops (intervals)
		// - no need to re-request timetable if navigating along one route
		init();
	}
});
init();