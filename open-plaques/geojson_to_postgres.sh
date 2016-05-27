ogr2ogr -f PostgreSQL PG:dbname=tom -lco GEOM_TYPE=geography -overwrite -nln plaques open-plaques.geojson
