
import java.net.URI;
import org.apache.log4j.Logger;

import de.fhpotsdam.unfolding.core.Coordinate;
import de.fhpotsdam.unfolding.geo.MercatorProjection;
import de.fhpotsdam.unfolding.geo.Transformation;
import de.fhpotsdam.unfolding.providers.*;

class CartoDBBasemapProvider extends de.fhpotsdam.unfolding.providers.AbstractMapTileUrlProvider {

  private String basemap = null;
  
  public AbstractMapProvider masterProvider = null;

  public CartoDBBasemapProvider(String basemap) {
    super(new MercatorProjection(26, new Transformation(1.068070779e7, 0.0f, 3.355443185e7, 0.0,
        -1.068070890e7, 3.355443057e7)));
    this.basemap = basemap;
  }

  public String getZoomString(Coordinate coordinate) {
    return (int) coordinate.zoom + "/" + (int) coordinate.column + "/" + (int) coordinate.row;
  }

  @Override
  public int tileWidth() {
    return 256;
  }

  @Override
  public int tileHeight() {
    return 256;
  }

  @Override
  public String[] getTileUrls(Coordinate coordinate) {
    /*
     * CartoDB Url Template
     * http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png
     */
    try {
      // This should do proper URI encoding for the sql query and the carto css
      URI uri = new URI(
          "http",
          "1.basemaps.cartocdn.com",
          "/" + this.basemap + "/" + getZoomString(coordinate) + ".png",
          null,
          null);
      String request = uri.toASCIIString();

      // This should be our final url
      println("CartoDB-Tile: " + request);

      // Now we can optionally blend the cartodb-tiles onto a basemap layer
      if (this.masterProvider != null) {
        // We use the internal mechanism of the Map-Class, so we just have to provide the additional urls in the String-Array 
        String[] url = this.masterProvider.getTileUrls(coordinate);
        String[] blend = new String[url.length + 1];
        for (int i = 0; i < url.length; i++) {
          blend[i] = url[i];
        }
        blend[blend.length - 1] = request;        
        return blend;
      } else {
        // Return the plain url
        return new String[]{request};
      }

    } catch (Exception e) {
      // Problem with url encoding, how to crash properly?
      println("Unable to create CartoDB Urls: " + e.getLocalizedMessage());
      return new String[]{""};
    }
  }
}