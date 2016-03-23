import requests
import json

def get_events(page = False):
    token = "" ## Put your API token here to run this script, but don't commit it to git, which would essentially make it public  
    data = {
        "expand":"venue",
	## Example - could request events within a buffer of a lat/lon point
        #    "location.latitude": "51.5218991",
        #    "location.longitude": "-0.1381519",
        #    "location.within": "1km",

	## Instead - here we request all events in London
        "venue.city": "london",
        "start_date.range_start": "2016-03-23T10:00:00",
        "start_date.range_end": "2016-03-30T21:00:00",
    }

    if (page):
        data['page'] = page

    response = requests.get(
        "https://www.eventbriteapi.com/v3/events/search/",
        headers = {
            "Authorization": "Bearer "+token,
        },
        params=data,
        verify = True,  # Verify SSL certificate
    )
    return response.json()

events = []
last = False
page = 1

# The API returns the data in pages of 50 events,
# so loop until we have all the pages
while(not last):
    r = get_events(page)
    print str(r['pagination']['page_number']) + " of " + str(r['pagination']['page_count'])
    events = events + r['events']
    page = r['pagination']['page_number']+1
    last = r['pagination']['page_count'] == r['pagination']['page_number']

with open('events.json', 'w') as out:
    out.write(json.dumps(events))
