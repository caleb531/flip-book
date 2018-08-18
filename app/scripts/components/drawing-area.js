class DrawingAreaComponent {

  oninit({attrs: {frame, previousFrame, showPreviousFrame, onEndDraw = null, drawingEnabled = true}}) {
    this.frame = frame;
    this.previousFrame = previousFrame;
    this.showPreviousFrame = showPreviousFrame;
    if (onEndDraw) {
      this.onEndDraw = onEndDraw;
    }
    this.drawingEnabled = drawingEnabled;
  }

  initSelectedFrame({dom}) {
    this.canvas = dom;
    this.ctx = this.canvas.getContext('2d');
    this.canvasScaleFactor = this.canvas.width / this.canvas.offsetWidth;
    this.mousedown = false;
    this.lastX = null;
    this.lastY = null;
  }

  onupdate({attrs: {frame}}) {
    if (frame !== this.frame) {
      this.frame = frame;
      this.render();
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
      this.frame.undoHistory.length = 0;
      this.render();
    } else {
      event.redraw = false;
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
    } else {
      event.redraw = false;
    }
  }

  handleMouseup(event) {
    event.preventDefault();
    if (this.drawingEnabled && this.mousedown) {
      this.mousedown = false;
      if (this.onEndDraw) {
        this.onEndDraw();
      }
    } else {
      event.redraw = false;
    }
  }

  render() {
    this.frame.render(this.ctx);
  }

  reset() {
    this.frame.reset();
    this.frame.clearCanvas(this.ctx);
  }

  undo() {
    this.frame.undo();
    this.render();
    if (this.onEndDraw) {
      this.onEndDraw();
    }
  }

  redo() {
    this.frame.redo();
    this.render();
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
        oncreate: (vnode) => this.initSelectedFrame(vnode),
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
