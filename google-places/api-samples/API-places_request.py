import requests
import json
import random

lat = "51.511732"
lon = "-0.123270"
place_type = "cafe"
API_KEY="AIzaSyBgo0C-bUIQ1276K8gt-DaikKwoYd_Ay_M"

def get_nearby_places(lat,lon,place_type):
	url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
	params = {
		"location":lat+","+lon,
		"radius": 300,
		"type": place_type,
		"key": API_KEY
	}
	request = requests.get(url,params=params).json()
	place_ids = [place["place_id"] for place in request["results"]]
	return place_ids

def get_place_details(id):
	url = "https://maps.googleapis.com/maps/api/place/details/json"
	params = {
		"key": API_KEY,
		"placeid": id
	}
	place = requests.get(url,params=params).json()["result"]

	if "price_level" in place:
		place["price"]=place["price_level"]
	else:
		place["price"]=random.randint(1,4)

	feature = {
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates":[
				place["geometry"]["location"]["lng"],
				place["geometry"]["location"]["lat"]
			]
		},
		"properties": {
			"name":                  place["name"],
			"place_id":              place["place_id"],
			"formatted_phone_number":place["formatted_phone_number"],
			"url":                   place["url"],
			"formatted_address":     place["formatted_address"],
			"website":               place["website"],
			"price":                 place["price"],
			"rating":                place["rating"], # look in yelp for rating by name
			"reviews":               [{
										"text":r["text"],
										"rating":r["rating"]
									} for r in place["reviews"]],
			"photos":                [p["photo_reference"] for p in place["photos"]],
			"opening_hours":         place["opening_hours"]["periods"]
		}
	}
	return feature

def get_distance(orig_lat,orig_lon,dest_lat,dest_lon):
	url = "https://maps.googleapis.com/maps/api/distancematrix/json"
	params = {
		"origins":str(orig_lat)+","+str(orig_lon),
		"destinations":str(dest_lat)+","+str(dest_lon),
		"mode":"walking",
		"key":API_KEY
	}
	matrix = requests.get(url,params=params).json()
	text = matrix["rows"][0]["elements"][0]["duration"]["text"]
	distance = text.split(" ")[0]
	return distance


def get_places(lat,lon,place_type):
	ids = get_nearby_places(lat,lon,place_type)
	places = []
	for place_id in ids:
		place = get_place_details(place_id)

		place_lon = place["geometry"]["coordinates"][0]
		place_lat = place["geometry"]["coordinates"][1]
		distance = get_distance(lat,lon,place_lat,place_lon)
		place["properties"]["distance"] = distance
		places.append(place)

	return places
