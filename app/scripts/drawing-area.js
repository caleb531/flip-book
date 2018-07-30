class DrawingArea {

  constructor({canvas, frame, onEndDraw, editingEnabled = true}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.canvasScaleFactor = canvas.width / canvas.offsetWidth;
    this.frame = frame;
    this.mousedown = false;
    this.lastX = null;
    this.lastY = null;
    this.onEndDraw = onEndDraw;
    this.editingEnabled = editingEnabled;
    this.bindMouseEvents();
    this.render();
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
  }

  handleMousedown(event) {
    if (this.editingEnabled) {
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
    if (this.mousedown && this.editingEnabled) {
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
    if (this.editingEnabled) {
      this.mousedown = false;
      this.onEndDraw();
    }
  }

  render() {
    this.frame.render(this.ctx);
  }

  undo() {
    this.frame.undo(this.ctx);
    this.onEndDraw();
  }

  redo() {
    this.frame.redo(this.ctx);
    this.onEndDraw();
  }

}

export default DrawingArea;