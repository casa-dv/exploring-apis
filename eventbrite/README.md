# Eventbrite API

This folder contains an example request to the Eventbrite API:
- request.py has the code to request the data
- events.json has the result
- jq-filter.sh is a command-line script to filter the data down to just the essentials (could be different for different visualisations, this is basically an optional step)
- events-essential.json has the filtered data, which is used in the sketch
- london_events_sketch has a processing sketch that uses the Unfolding library to draw the events on a map

Here is the [full documentation](https://www.eventbrite.com/developer/v3/quickstart/) for the API

The main request we're interested in is the [events search](https://www.eventbrite.com/developer/v3/endpoints/events/#ebapi-get-events-search)

## Note on jq

[jq](https://stedolan.github.io/jq/) is a tool I find helpful for exploring and processing JSONfiles. It can pretty-print, filter and transform JSON data - probably worth a look. 

In this folder, jq-filter.sh is an example of a jq command that does all the basic filtering we need.

