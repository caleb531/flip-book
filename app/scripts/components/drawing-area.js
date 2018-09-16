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
      // this.story.save();
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

  stabilizeGroup() {
    let origGroup = this.frame.groups[this.frame.groups.length - 1];
    let newGroup = {
      styles: origGroup.styles,
      points: []
    };
    let threshold = 10;
    let currentOrigX = 0;
    let currentOrigY = 0;
    let currentNextX = 0;
    let currentNextY = 0;
    for (let p = 0; p < origGroup.points.length - 1; p += 1) {
      let origPoint = origGroup.points[p];
      let nextPoint = origGroup.points[p + 1];
      currentOrigX += origPoint[0];
      currentOrigY += origPoint[1];
      currentNextX += origPoint[0] + nextPoint[0];
      currentNextY += origPoint[1] + nextPoint[1];
      let absSlope = (currentNextY - currentOrigY) / (currentNextX - currentOrigX);
      console.log(absSlope);
      // if ()) {
      //   console.log(newGroup.points[newGroup.points.length - 1][0], newGroup.points[newGroup.points.length - 1][1]);
      //   // newGroup.points.push([
      //   //   currentOrigX - currentNewX,
      //   //   currentOrigY - currentNewY
      //   // ]);
      //   // currentNewX += newGroup.points[newGroup.points.length - 1][0];
      //   // currentNewY += newGroup.points[newGroup.points.length - 1][1];
      // }
    }
    // this.frame.groups[this.frame.groups.length - 1] = newGroup;
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
