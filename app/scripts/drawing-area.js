class DrawingArea {

  constructor({canvas, onEndDraw, drawingEnabled = true}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.canvasScaleFactor = canvas.width / canvas.offsetWidth;
    this.mousedown = false;
    this.lastX = null;
    this.lastY = null;
    this.onEndDraw = onEndDraw;
    this.drawingEnabled = drawingEnabled;
    this.bindMouseEvents();
  }

  bindMouseEvents() {
    this.canvas.addEventListener('mousedown', (event) => {
      event.preventDefault();
      this.handleMousedown(event);
    });
    this.canvas.addEventListener('mousemove', (event) => {
      event.preventDefault();
      this.handleMousemove(event);
    });
    this.canvas.addEventListener('mouseup', (event) => {
      event.preventDefault();
      this.handleMouseup(event);
    });
    this.canvas.addEventListener('mouseout', (event) => {
      event.preventDefault();
      this.handleMouseup(event);
    });
  }

  handleMousedown(event) {
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

  handleMouseup() {
    if (this.drawingEnabled && this.mousedown) {
      this.mousedown = false;
      this.onEndDraw();
    }
  }

  reset() {
    this.frame.reset();
    this.frame.clearCanvas(this.ctx);
  }

  render() {
    this.frame.render(this.ctx);
  }

  undo() {
    this.frame.undo();
    this.frame.render(this.ctx);
    this.onEndDraw();
  }

  redo() {
    this.frame.redo();
    this.frame.render(this.ctx);
    this.onEndDraw();
  }

}

export default DrawingArea;
