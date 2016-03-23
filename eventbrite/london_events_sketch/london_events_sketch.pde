import de.fhpotsdam.unfolding.mapdisplay.*;
import de.fhpotsdam.unfolding.utils.*;
import de.fhpotsdam.unfolding.marker.*;
import de.fhpotsdam.unfolding.geo.*;
import de.fhpotsdam.unfolding.*;
import de.fhpotsdam.utils.*;
import de.fhpotsdam.unfolding.providers.*;
import java.util.List;
import java.util.Date;
import java.util.TimeZone;
import java.text.DateFormat;
import java.text.SimpleDateFormat;

static String TIMEZONE = "GMT";

UnfoldingMap map;
JSONArray json;
LabeledMarker activeMarker;

DateFormat dateFormatOut;
DateFormat dateFormatIn;
int minTime;
int maxTime;
int minTimeFilter;
int maxTimeFilter;

void setup() {
  size(1200, 900, P2D);
  map = new UnfoldingMap(this, new CartoDBBasemapProvider("light_all"));


  // setup date formatter (used in clockTimeToString)
  dateFormatOut = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
  dateFormatIn = new SimpleDateFormat("yyyy-MM-dd'T'kk:mm:ss");

  // listen for key/mouse zoom and pan
  MapUtils.createDefaultEventDispatcher(this, map);

  // set location
  Location london = new Location(51.51, -0.105);
  map.zoomAndPanTo(12, london);

  // limit zoom levels
  map.setZoomRange(9, 15);

  json = loadJSONArray("data/events-essential.json");
  for (int i = 0; i < json.size (); i++) {
    // Get each object in the array
    JSONObject event = json.getJSONObject(i); 

    // Get position
    float lat = event.getFloat("lat");
    float lon = event.getFloat("lon");

    String start = event.getString("start");
    String end = event.getString("end");
    String name = event.getString("name");
    try {
      Date startDate = dateFormatIn.parse(start);
      Date endDate = dateFormatIn.parse(end);
      // add a simple circular marker
      LabeledMarker cm = new LabeledMarker(new Location(lat, lon), name, startDate, endDate);

      map.addMarker(cm);
    } 
    catch (Exception e) {
      println(str(i) + " error " + e);
    }
  }
}

void draw() {
  background(255);
  map.draw();
  if (activeMarker != null) {
    Location l = activeMarker.getLocation();
    ScreenPosition pos = map.getScreenPosition(l);
    activeMarker.drawActive(pos.x, pos.y);
  }
}

void drawControl() {
}

void mousePressed() {
  // check if a marker was clicked
  LabeledMarker hm = (LabeledMarker) map.getFirstHitMarker(mouseX, mouseY);

  if (hm != null) {
    // toggle marker selected state, which uses 'highlight' styles
    boolean toSet = !hm.isSelected();
    List<Marker> am = map.getMarkers();
    for (Marker a : am) {
      a.setSelected(false);
    }
    hm.setSelected(toSet);
    if (toSet) {
      activeMarker = hm;
    } else {
      activeMarker = null;
    }
  }
}

String clockTimeToString(int clockTime) {
  // convert clock unix time seconds to milliseconds for java date
  long clockTimeMilliseconds = 1000 * (long)clockTime;
  Date d = new Date(clockTimeMilliseconds);

  // format date using global date formatter, set up in setup
  String timeString = dateFormatOut.format(d);
  return timeString;
}

