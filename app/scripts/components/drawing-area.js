class DrawingAreaComponent {

  oninit({dom, attrs: {frame, previousFrame, showPreviousFrame, onEndDraw = null, drawingEnabled = true}}) {
    this.canvas = dom;
    this.ctx = this.canvas.getContext('2d');
    this.canvasScaleFactor = this.canvas.width / this.canvas.offsetWidth;
    this.frame = frame;
    this.previousFrame = previousFrame;
    this.showPreviousFrame = showPreviousFrame;
    this.mousedown = false;
    this.lastX = null;
    this.lastY = null;
    if (onEndDraw) {
      this.onEndDraw = onEndDraw;
    }
    this.drawingEnabled = drawingEnabled;
  }

  onupdate({attrs: {frame}}) {
    if (frame !== this.frame) {
      this.frame = frame;
      this.frame.render(this.ctx);
    }
  }

  handleMousedown(event) {
    event.preventDefault();
    if (this.drawingEnabled) {
      this.mousedown = true;
      // Cache computed canvas offsets for the duration of the drag
      this.canvasOffsetLeft = this.canvas.parentElement.offsetLeft;
      this.canvasOffsetTop = this.canvas.parentElement.offsetTop;
      let startX = (event.pageX - this.canvasOffsetLeft) * this.canvasScaleFactor;
      let startY = (event.pageY - this.canvasOffsetTop) * this.canvasScaleFactor;
      this.frame.startNewGroup();
      this.frame.addPoint(startX, startY);
      this.lastX = startX;
      this.lastY = startY;
      this.render();
      this.frame.undoHistory.length = 0;
    }
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
        this.render();
      }
    }
  }

  handleMouseup(event) {
    event.preventDefault();
    if (this.drawingEnabled && this.mousedown) {
      this.mousedown = false;
      if (this.onEndDraw) {
        this.onEndDraw();
      }
    }
  }

  reset() {
    this.frame.reset();
    this.frame.clearCanvas(this.ctx);
  }

  undo() {
    this.frame.undo();
    this.frame.render(this.ctx);
    if (this.onEndDraw) {
      this.onEndDraw();
    }
  }

  redo() {
    this.frame.redo();
    this.frame.render(this.ctx);
    if (this.onEndDraw) {
      this.onEndDraw();
    }
  }

  view() {
    return m('div.drawing-area', [
      m('canvas.previous-frame', {
        width: DrawingAreaComponent.width,
        height: DrawingAreaComponent.height
      }),
      m('canvas.selected-frame', {
        width: DrawingAreaComponent.width,
        height: DrawingAreaComponent.height,
        onmousedown: (event) => this.handleMousedown(event),
        onmousemove: (event) => this.handleMousemove(event),
        onmouseup: (event) => this.handleMouseup(event),
        onmouseout: (event) => this.handleMouseup(event)
      })
    ]);
  }

}
DrawingAreaComponent.width = 1600;
DrawingAreaComponent.height = 900;

export default DrawingAreaComponent;