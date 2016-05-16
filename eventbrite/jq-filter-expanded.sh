
cat events-expanded.json | jq '[
	.[] |
	{
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [
				.venue.address.longitude,
				.venue.address.latitude
			],
		},
		properties: {
			start: .start.local,
			name: .name.text,
			"end": .["end"].local,
			description: .description.text,
			lat: .venue.address.latitude,
			lon: .venue.address.longitude,
			cat_id: .category.id,
			cat_name: .category.short_name,
			tickets: [.ticket_classes[] | {
				free: .free,
				name: .name,
				description: .description,
				cost: .cost.major_value
			}]
		}
	}
]' > events-expanded-essential.json
