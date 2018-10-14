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

  handleMousedown(event) {
    event.preventDefault();
    if (this.drawingEnabled) {
      this.mousedown = true;
      // Cache canvas size/position computations for the duration of the drag
      this.canvasScaleFactor = this.canvas.width / this.canvas.offsetWidth;
      this.canvasOffsetLeft = event.target.parentElement.offsetLeft;
      this.canvasOffsetTop = event.target.parentElement.offsetTop;
      let startX = (event.pageX - this.canvasOffsetLeft) * this.canvasScaleFactor;
      let startY = (event.pageY - this.canvasOffsetTop) * this.canvasScaleFactor;
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
    event.redraw = false;
  }

  handleMouseup(event) {
    event.preventDefault();
    if (this.drawingEnabled && this.mousedown) {
      this.mousedown = false;
      this.story.save();
    } else {
      event.redraw = false;
    }
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
