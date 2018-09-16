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
      // TODO: add stabilization logic here
      this.stabilizeGroup();
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

  calculateAngle(lastX, lastY, currentX, currentY) {
    let angle = Math.atan2(lastY - currentY, lastX - currentX) * (180 / Math.PI);
    if (angle < 0) {
      angle = 360 + angle;
    }
    return angle;
  }

  stabilizeGroup() {
    let origGroup = this.frame.groups[this.frame.groups.length - 1];
    let newGroup = {
      styles: origGroup.styles,
      points: []
    };
    if (origGroup.points.length < 3) {
      return;
    }
    let threshold = -1;
    let lastX = origGroup.points[0][0];
    let lastY = origGroup.points[0][1];
    let currentX = lastX + origGroup.points[1][0];
    let currentY = lastY + origGroup.points[1][1];
    let lastAngle = this.calculateAngle(lastX, lastY, currentX, currentY);
    let newX = origGroup.points[0][0];
    let newY = origGroup.points[0][1];
    newGroup.points.push([newX, newY]);
    for (let p = 2; p < origGroup.points.length; p += 1) {
      let origPoint = origGroup.points[p];
      currentX += origPoint[0];
      currentY += origPoint[1];
      let currentAngle = this.calculateAngle(lastX, lastY, currentX, currentY);
      if (p === (origGroup.points.length - 1) || (currentAngle !== lastAngle && Math.abs(currentAngle - lastAngle) >= threshold)) {
        lastAngle = currentAngle;
        lastX = currentX;
        lastY = currentY;
        newGroup.points.push([
          currentX - newX,
          currentY - newY
        ]);
        newX += newGroup.points[newGroup.points.length - 1][0];
        newY += newGroup.points[newGroup.points.length - 1][1];
      }
    }
    this.frame.groups[this.frame.groups.length - 1] = newGroup;
    console.log(`${origGroup.points.length - newGroup.points.length} points removed!`);
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
