import CanvasComponent from './canvas.js';

class DrawingAreaComponent {

  oninit({attrs: {selectedFrame, previousFrame, showPreviousFrame, onEndDraw = null, drawingEnabled = true}}) {
    this.selectedFrame = selectedFrame;
    this.previousFrame = previousFrame;
    this.showPreviousFrame = showPreviousFrame;
    if (onEndDraw) {
      this.onEndDraw = onEndDraw;
    }
    this.drawingEnabled = drawingEnabled;
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
      this.selectedFrame.startNewGroup();
      this.selectedFrame.addPoint(startX, startY);
      this.lastX = startX;
      this.lastY = startY;
      this.selectedFrame.undoHistory.length = 0;
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
        this.selectedFrame.addPoint(diffX, diffY);
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
      if (this.onEndDraw) {
        this.onEndDraw();
      }
    } else {
      event.redraw = false;
    }
  }

  undo() {
    this.selectedFrame.undo();
    this.renderCanvas();
    if (this.onEndDraw) {
      this.onEndDraw();
    }
  }

  redo() {
    this.selectedFrame.redo();
    this.renderCanvas();
    if (this.onEndDraw) {
      this.onEndDraw();
    }
  }

  view() {
    return m('div.drawing-area', [
      this.previousFrame ? m(CanvasComponent, {
        class: 'previous-frame',
        frame: this.previousFrame,
        width: DrawingAreaComponent.width,
        height: DrawingAreaComponent.height
      }) : null,
      m(CanvasComponent, {
        class: 'selected-frame',
        frame: this.selectedFrame,
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
