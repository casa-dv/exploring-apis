cat events.json | jq '[
	.[] |
	{
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [
				.venue.address.longitude,
				.venue.address.latitude
			]
		},
		properties: {
			start: .start.local,
			name: .name.text,
			"end": .["end"].local,
			cat: .category_id
		}
	}
]' > events-essential.json
