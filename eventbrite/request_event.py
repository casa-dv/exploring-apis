import requests
import json
import request_token

def get_event(token):
    data = {
	## Example - could request events within a buffer of a lat/lon point
        "location.latitude": "51.5218991",
        "location.longitude": "-0.1381519",
        "location.within": "1km",

	## Instead - could request all events in London
        #"venue.city": "london",

        ## Could also limit by date
        #"start_date.range_start": "2016-03-23T10:00:00",
        #"start_date.range_end": "2016-03-30T21:00:00",

        ## Expand seems to work with comma separation,
        ## if in alphabetical order
        "expand": "ticket_classes,venue"
    }

    response = requests.get(
        "https://www.eventbriteapi.com/v3/events/search/",
        headers = {
            "Authorization": "Bearer "+token,
        },
        params=data,
        verify = True,  # Verify SSL certificate
    )
    json = response.json()
    return json['events']

if __name__ == "__main__":
    event = get_event(request_token.token)
    print(json.dumps(event))
