var express = require('express');
var http = require('http');
var app = express();
var tilelive = require('tilelive');
require('mbtiles').registerProtocols(tilelive);
tilelive.load('mbtiles:///home/tom/node-dbpedia/geo_coordinates_all.mbtiles', function(err, tiles) {
	if (err) {
		throw err;
	}app.set('port', 7777);

	app.get(/^\/tiles\/(\d+)\/(\d+)\/(\d+).pbf$/, function(req, res){
		var z = req.params[0];
		var x = req.params[1];
		var y = req.params[2];
		console.log('get tile %d, %d, %d', z, x, y);
		tiles.getTile(z, x, y, function(err, tile, headers) {
			if (err) {
				res.status(404);
				res.send(err.message);
				console.log(err.message);
			} else {
				res.set(headers);
				res.send(tile);
			}
		});
	});

	app.use(express.static('tileserver_demo'));

	http.createServer(app).listen(app.get('port'), function() {
		console.log('Express server listening on port ' + app.get('port'));
	});
});