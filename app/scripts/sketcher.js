import Frame from './frame.js';

class Sketcher {

  constructor({canvas}) {
    this.canvas = canvas;
    this.frame = new Frame({
      canvas: canvas,
      styles: {
        strokeStyle: '#000',
        lineWidth: 12,
        lineCap: 'round',
        lineJoin: 'round'
      }
    });
    // The actual size of the canvas divided by its display size
    this.canvasScaleFactor = 2;
    this.mousedown = false;
    this.lastX = null;
    this.lastY = null;
    this.bindMouseEvents();
  }

  bindMouseEvents() {
    this.canvas.addEventListener('mousedown', (event) => {
      event.preventDefault();
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
      this.frame.render();
    });
    this.canvas.addEventListener('mousemove', (event) => {
      event.preventDefault();
      if (this.mousedown) {
        let endX = (event.pageX - this.canvasOffsetLeft) * this.canvasScaleFactor;
        let endY = (event.pageY - this.canvasOffsetTop) * this.canvasScaleFactor;
        let diffX = endX - this.lastX;
        let diffY = endY - this.lastY;
        if (diffX !== 0 || diffY !== 0) {
          this.frame.addPoint(diffX, diffY);
          this.lastX = endX;
          this.lastY = endY;
          this.frame.render();
        }
      }
    });
    this.canvas.addEventListener('mouseup', (event) => {
      event.preventDefault();
      this.mousedown = false;
    });
  }

}

export default Sketcher;
