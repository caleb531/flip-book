class DrawingArea {

  constructor({canvas, frame, editingEnabled = true}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.canvasScaleFactor = canvas.width / canvas.offsetWidth;
    this.frame = frame;
    this.mousedown = false;
    this.lastX = null;
    this.lastY = null;
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
      this.canvasOffsetLeft = this.canvas.offsetLeft;
      this.canvasOffsetTop = this.canvas.offsetTop;
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
    }
  }

  render() {
    this.frame.render(this.ctx);
  }

  undo() {
    this.frame.undo(this.ctx);
  }

  redo() {
    this.frame.redo(this.ctx);
  }

}

export default DrawingArea;
