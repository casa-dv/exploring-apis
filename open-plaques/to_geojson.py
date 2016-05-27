import csv
import json

with open('open-plaques-london-2016-05-22.csv','r') as inf:
	with open('open-plaques.geojson','w') as outf:
		outf.write('{"type":"FeatureCollection","features":[\n')
		r = csv.DictReader(inf)
		first = True
		for line in r:

			if line['longitude'] and line['latitude']:

				if not first:
					outf.write(",\n")
				else:
					first = False

				feature = {
					"type":"Feature",
					"geometry":{
						"type":"Point",
						"coordinates":[float(line['longitude']),float(line['latitude'])]
					},
					"properties": {
						"id":                    line['id'],
						"inscription":           line['inscription'],
						# "country":               line['country'],
						# "area":                  line['area'],
						"erected":               line['erected'],
						"main_photo":            line['main_photo'],
						"colour":                line['colour'],
						"organisations":         line['organisations'],
						# "series":                line['series'],
						# "series_ref":            line['series_ref'],
						# "number_of_subjects":    line['number_of_subjects'],
						"lead_subject_name":     line['lead_subject_name'],
						"lead_subject_born_in":  line['lead_subject_born_in'],
						"lead_subject_died_in":  line['lead_subject_died_in'],
						"lead_subject_type":     line['lead_subject_type'],
						"lead_subject_roles":    line['lead_subject_roles'],
						"lead_subject_wikipedia":line['lead_subject_wikipedia'],
						# "lead_subject_dbpedia":  line['lead_subject_dbpedia'],
						# "lead_subject_image":    line['lead_subject_image'],
						# "subjects":              line['subjects']
					}
				}
				outf.write(json.dumps(feature))

		outf.write('\n]}')