class Frame {

  // Default arguments get evaluated at call time (unlike Python); see:
  // <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters#Evaluated_at_call_time>
  constructor({styles = {}, groups = [], undoHistory = []} = {}) {
    this.temporaryId = Frame.nextAutoIncrementedId;
    Frame.nextAutoIncrementedId += 1;
    this.styles = Object.assign({
      strokeStyle: '#000',
      lineWidth: 12,
      lineCap: 'round',
      lineJoin: 'round'
    }, styles);
    this.groups = groups;
    // The undo history only exists for the life of the current page
    this.undoHistory = undoHistory;
  }

  startNewGroup() {
    this.groups.push({
      points: []
    });
  }

  addPoint(x, y) {
    this.groups[this.groups.length - 1].points.push([x, y]);
  }

  reset() {
    this.groups.length = 0;
    this.undoHistory.length = 0;
  }

  render(ctx, {scale = 1, backgroundColor = null} = {}) {
    this.clearCanvas(ctx);
    if (scale !== 1) {
      this.scaleCanvas(ctx, scale);
    }
    if (backgroundColor) {
      this.setBackground(ctx, backgroundColor);
    }
    this.setCanvasStyles(ctx);
    this.drawGroups(ctx);
  }

  clearCanvas(ctx) {
    ctx.resetTransform();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  scaleCanvas(ctx, scale) {
    ctx.scale(scale, scale);
  }

  setBackground(ctx, backgroundColor) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = 'transparent';
  }

  setCanvasStyles(ctx) {
    for (let styleKey in this.styles) {
      if (Object.prototype.hasOwnProperty.call(this.styles, styleKey)) {
        ctx[styleKey] = this.styles[styleKey];
      }
    }
  }

  drawGroups(ctx) {
    for (let g = 0; g < this.groups.length; g += 1) {
      let group = this.groups[g];
      let currentX = group.points[0][0];
      let currentY = group.points[0][1];
      if (group.points.length === 1) {
        // Draw a circle
        ctx.fillStyle = this.styles.strokeStyle;
        ctx.beginPath();
        ctx.arc(currentX, currentY, this.styles.lineWidth / 2, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
        ctx.fillStyle = 'transparent';
      } else {
        ctx.beginPath();
        ctx.moveTo(currentX, currentY);
        for (let p = 1; p < group.points.length; p += 1) {
          currentX += group.points[p][0];
          currentY += group.points[p][1];
          ctx.lineTo(currentX, currentY);
        }
        ctx.stroke();
        ctx.closePath();
      }
    }
  }

  undo() {
    if (this.groups.length > 0) {
      this.undoHistory.push(this.groups.pop());
    }
  }

  redo() {
    if (this.undoHistory.length > 0) {
      this.groups.push(this.undoHistory.pop());
    }
  }

  toJSON() {
    return {
      styles: this.styles,
      groups: this.groups,
      undoHistory: this.undoHistory
    };
  }

}
Frame.nextAutoIncrementedId = 0;

export default Frame;
