cat events.json | jq '[
	.[] | 
	{
		start: .start.local, 
		name: .name.text, 
		"end": .["end"].local, 
		lat: .venue.address.latitude, 
		lon: .venue.address.longitude,
		cat: .category_id
	}
]' > events-essential.json 
