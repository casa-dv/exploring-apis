import de.fhpotsdam.unfolding.marker.*;
import de.fhpotsdam.unfolding.geo.*;
import processing.core.*;
import java.util.HashMap;
import java.util.Date;

/**
 * A point marker which can show a label containing the marker's name.
 */
public class LabeledMarker extends SimplePointMarker {

  protected String name;
  protected Date start;
  protected Date end;
  protected float size = 15;
  protected int space = 10;

  private PFont font;
  private float fontSize = 12;

  public LabeledMarker(Location location, String name, Date startDate, Date endDate) {
    this.location = location;
    this.name = name;
    this.start = startDate;
    this.end = endDate;
  }

  /**
   * Displays this marker's name in a box.
   */
  public void draw(PGraphics pg, float x, float y) {
    pg.pushStyle();
    pg.pushMatrix();
    if (selected) {
      pg.translate(0, 0);
    }
    pg.strokeWeight(strokeWeight);
    if (selected) {
      pg.fill(highlightColor);
      pg.stroke(highlightStrokeColor);
    } else {
      pg.fill(0);
      pg.stroke(strokeColor);
    }
    pg.ellipse(x, y, size, size);// TODO use radius in km and convert to px

    // label
    if (selected && name != null) {
      if (font != null) {
        pg.textFont(font);
      }
      pg.fill(highlightColor);
      pg.stroke(highlightStrokeColor);
      pg.rect(x + strokeWeight / 2, y - fontSize + strokeWeight / 2 - space, pg.textWidth(name) + space * 1.5f, 
      fontSize + space);
      pg.fill(255, 255, 255);
      pg.text(name, Math.round(x + space * 0.75f + strokeWeight / 2), 
      Math.round(y + strokeWeight / 2 - space * 0.75f));
    }
    pg.popMatrix();
    pg.popStyle();
  }
  
  public void drawActive(float x, float y) {
    pushStyle();
    pushMatrix();
    if (selected) {
      translate(0, 0);
    }
    strokeWeight(strokeWeight);
    if (selected) {
      fill(highlightColor);
      stroke(highlightStrokeColor);
    } else {
      fill(0);
      stroke(strokeColor);
    }
    ellipse(x, y, size, size);// TODO use radius in km and convert to px

    // label
    if (selected && name != null) {
      if (font != null) {
        textFont(font);
      }
      fill(highlightColor);
      stroke(highlightStrokeColor);
      rect(x + strokeWeight / 2, y - fontSize + strokeWeight / 2 - space, 
      textWidth(name) + space * 1.5f, fontSize + space);
      fill(255, 255, 255);
      text(name, Math.round(x + space * 0.75f + strokeWeight / 2), 
      Math.round(y + strokeWeight / 2 - space * 0.75f));
    }
    popMatrix();
    popStyle();
  }

  public String getName() {
    return name;
  }
}

