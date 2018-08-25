import FrameComponent from './frame.js';

class DrawingAreaComponent extends FrameComponent {

  oninit({attrs: {frame, save, drawingEnabled = true}}) {
    super.oninit({attrs: {frame}});
    this.frame = frame;
    this.save = save;
    this.drawingEnabled = drawingEnabled;
  }

  onupdate({attrs: {frame, save, drawingEnabled = true}}) {
    this.save = save;
    this.drawingEnabled = drawingEnabled;
    super.onupdate({attrs: {frame}});
  }

  handleMousedown(event) {
    event.preventDefault();
    if (this.drawingEnabled) {
      this.mousedown = true;
      // Cache computed canvas offsets for the duration of the drag
      this.canvasOffsetLeft = event.target.parentElement.offsetLeft;
      this.canvasOffsetTop = event.target.parentElement.offsetTop;
      let startX = (event.pageX - this.canvasOffsetLeft) * this.canvasScaleFactor;
      let startY = (event.pageY - this.canvasOffsetTop) * this.canvasScaleFactor;
      this.frame.startNewGroup();
      this.frame.addPoint(startX, startY);
      this.lastX = startX;
      this.lastY = startY;
      this.frame.undoHistory.length = 0;
      this.renderCanvas();
    }
    event.redraw = false;
  }

  handleMousemove(event) {
    event.preventDefault();
    if (this.mousedown && this.drawingEnabled) {
      let endX = (event.pageX - this.canvasOffsetLeft) * this.canvasScaleFactor;
      let endY = (event.pageY - this.canvasOffsetTop) * this.canvasScaleFactor;
      let diffX = endX - this.lastX;
      let diffY = endY - this.lastY;
      if (diffX !== 0 || diffY !== 0) {
        this.frame.addPoint(diffX, diffY);
        this.lastX = endX;
        this.lastY = endY;
        this.renderCanvas();
      }
    }
    event.redraw = false;
  }

  handleMouseup(event) {
    event.preventDefault();
    if (this.drawingEnabled && this.mousedown) {
      this.mousedown = false;
      this.save();
    } else {
      event.redraw = false;
    }
  }

  undo() {
    this.frame.undo();
    this.renderCanvas();
    this.save();
  }

  redo() {
    this.frame.redo();
    this.renderCanvas();
    this.save();
  }

  view() {
    return m('canvas.selected-frame', {
      width: FrameComponent.width,
      height: FrameComponent.height,
      onmousedown: (event) => this.handleMousedown(event),
      onmousemove: (event) => this.handleMousemove(event),
      onmouseup: (event) => this.handleMouseup(event),
      onmouseout: (event) => this.handleMouseup(event)
    });
  }

}
export default DrawingAreaComponent;
