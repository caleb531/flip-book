import FrameComponent from './frame.js';
import PanelComponent from './panel.js';

class DrawingAreaComponent extends FrameComponent {

  oninit({attrs: {story, frame, drawingEnabled = true}}) {
    this.story = story;
    super.oninit({attrs: {frame}});
    this.drawingEnabled = drawingEnabled;
  }

  oncreate({dom}) {
    super.oncreate({dom});
  }

  onupdate({attrs: {story, frame, drawingEnabled = true}}) {
    this.story = story;
    this.drawingEnabled = drawingEnabled;
    super.onupdate({attrs: {frame}});
  }

  handleDrawStart(event, pageX, pageY) {
    event.preventDefault();
    if (this.drawingEnabled) {
      this.mousedown = true;
      // Cache canvas size/position computations for the duration of the drag
      this.canvasScaleFactor = this.canvas.width / this.canvas.offsetWidth;
      this.canvasOffsetLeft = event.target.parentElement.offsetLeft;
      this.canvasOffsetTop = event.target.parentElement.offsetTop;
      let startX = (pageX - this.canvasOffsetLeft) * this.canvasScaleFactor;
      let startY = (pageY - this.canvasOffsetTop) * this.canvasScaleFactor;
      this.frame.startNewGroup({
        styles: Object.assign({}, this.story.frameStyles)
      });
      this.frame.addPoint(startX, startY);
      this.lastX = startX;
      this.lastY = startY;
      this.frame.resetUndoHistory();
    }
    PanelComponent.closeAllPanels();
  }

  handleDrawMove(event, pageX, pageY) {
    event.preventDefault();
    if (this.mousedown && this.drawingEnabled) {
      let endX = (pageX - this.canvasOffsetLeft) * this.canvasScaleFactor;
      let endY = (pageY - this.canvasOffsetTop) * this.canvasScaleFactor;
      let diffX = endX - this.lastX;
      let diffY = endY - this.lastY;
      if (diffX !== 0 || diffY !== 0) {
        this.frame.addPoint(diffX, diffY);
        this.lastX = endX;
        this.lastY = endY;
        this.render();
      }
    }
    event.redraw = false;
  }

  handleDrawEnd(event) {
    event.preventDefault();
    if (this.drawingEnabled && this.mousedown) {
      this.mousedown = false;
      this.optimizeStrokeGroup({
        group: this.frame.getLastStrokeGroup(),
        debug: window.location.hostname !== 'projects.calebevans.me'
      });
      this.story.save();
    } else {
      event.redraw = false;
    }
  }

  handleTouchStart(event) {
    if (event.changedTouches && event.changedTouches.length > 0) {
      this.handleDrawStart(event, event.changedTouches[0].pageX, event.changedTouches[0].pageY);
    }
  }

  handleTouchMove(event) {
    if (event.changedTouches && event.changedTouches.length > 0) {
      this.handleDrawMove(event, event.changedTouches[0].pageX, event.changedTouches[0].pageY);
    }
  }

  handleTouchEnd(event) {
    if (event.changedTouches && event.changedTouches.length > 0) {
      this.handleDrawEnd(event);
    }
  }

  handleMouseDown(event) {
    this.handleDrawStart(event, event.pageX, event.pageY);
  }

  handleMouseMove(event) {
    this.handleDrawMove(event, event.pageX, event.pageY);
  }

  handleMouseUp(event) {
    this.handleDrawEnd(event);
  }

  undo() {
    this.frame.undo();
    this.render();
    this.story.save();
  }

  redo() {
    this.frame.redo();
    this.render();
    this.story.save();
  }

  calculateAngle(currentX, currentY, nextX, nextY) {
    return Math.atan2(currentY - nextY, currentX - nextX);
  }

  optimizeStrokeGroup({group, debug = false}) {
    let prevAngle = 0;
    let newPoints = [group.points[0]];
    let currentX = 0;
    let currentY = 0;
    let nextX = 0;
    let nextY = 0;
    let nextPoint;
    if (group.points.length < 3) {
      return;
    }
    // There must be at least 3 points in the stroke group for simplification to
    // be possible
    for (let p = 1; p < (group.points.length - 1); p += 1) {
      let currentPoint = group.points[p];
      currentX += currentPoint[0];
      currentY += currentPoint[1];
      nextPoint = group.points[p + 1];
      nextX = currentX + nextPoint[0];
      nextY = currentY + nextPoint[1];
      let currentAngle = this.calculateAngle(currentX, currentY, nextX, nextY);
      // Remove redundant points along the same contiguous path, keeping only
      // the start and end points
      if (currentAngle !== prevAngle) {
        newPoints.push([
          currentX,
          currentY
        ]);
        currentX = 0;
        currentY = 0;
      }
      prevAngle = currentAngle;
    }
    if (nextPoint) {
      newPoints.push([
        currentX + nextPoint[0],
        currentY + nextPoint[1]
      ]);
    }
    if (debug) {
      console.log(`Trimmed ${group.points.length - newPoints.length} out of ${group.points.length} points (${100 - Math.round(newPoints.length / group.points.length * 100)}% savings)`);
    }
    group.points = newPoints;
  }

  view() {
    return m('canvas.selected-frame', {
      width: FrameComponent.width,
      height: FrameComponent.height,
      // Touch events
      ontouchstart: (event) => this.handleTouchStart(event),
      ontouchmove: (event) => this.handleTouchMove(event),
      ontouchend: (event) => this.handleTouchEnd(event),
      // Mouse events
      onmousedown: (event) => this.handleMouseDown(event),
      onmousemove: (event) => this.handleMouseMove(event),
      onmouseup: (event) => this.handleMouseUp(event),
      onmouseout: (event) => this.handleMouseUp(event)
    });
  }

}
export default DrawingAreaComponent;
