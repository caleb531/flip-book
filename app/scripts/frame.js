class Frame {

  constructor({canvas, styles}) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.styles = styles;
    this.groups = [];
    this.currentPointGroup = null;
  }

  startNewGroup() {
    this.groups.push({
      points: []
    });
  }

  addPoint(x, y) {
    this.groups[this.groups.length - 1].points.push([x, y]);
  }

  render() {
    this.clearCanvas();
    this.setCanvasStyles();
    this.drawGroups();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  setCanvasStyles() {
    for (let styleKey in this.styles) {
      if (Object.prototype.hasOwnProperty.call(this.styles, styleKey)) {
        this.ctx[styleKey] = this.styles[styleKey];
      }
    }
  }

  drawGroups() {
    for (let g = 0; g < this.groups.length; g += 1) {
      let group = this.groups[g];
      let currentX = group.points[0][0];
      let currentY = group.points[0][1];
      if (group.points.length === 1) {
        // Draw a circle
        this.ctx.beginPath();
        this.ctx.arc(currentX, currentY, this.styles.lineWidth / 2, 0, Math.PI * 2, false);
        this.ctx.fill();
        this.ctx.closePath();
      } else {
        this.ctx.beginPath();
        this.ctx.moveTo(currentX, currentY);
        for (let p = 1; p < group.points.length; p += 1) {
          currentX += group.points[p][0];
          currentY += group.points[p][1];
          this.ctx.lineTo(currentX, currentY);
        }
        this.ctx.stroke();
        this.ctx.closePath();
      }
    }
  }

}

export default Frame;
