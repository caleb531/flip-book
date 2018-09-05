class Frame {

  // Default arguments get evaluated at call time (unlike Python); see:
  // <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters#Evaluated_at_call_time>
  constructor({styles = {}, groups = [], undoHistory = []} = {}) {
    this.temporaryId = Frame.nextAutoIncrementedId;
    Frame.nextAutoIncrementedId += 1;
    this.styles = Object.assign({}, Frame.defaultStyles, _.pick(styles, [
      'strokeStyle',
      'lineWidth'
    ]));
    this.lastRenderedStyles = {};
    this.groups = groups;
    this.undoHistory = undoHistory;
  }

  startNewGroup({styles}) {
    this.groups.push({
      points: [],
      styles
    });
  }

  addPoint(x, y) {
    this.groups[this.groups.length - 1].points.push([x, y]);
  }

  countPointsInLastGroup() {
    if (this.groups.length > 0) {
      return this.groups[this.groups.length - 1].points.length;
    } else {
      return 0;
    }
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

  setGlobalStyles(ctx) {
    ctx.lineCap = this.styles.lineCap;
    ctx.lineJoin = this.styles.lineJoin;
  }

  setGroupStyles(ctx, group) {
    this.setGroupStyle(ctx, group, 'strokeStyle');
    this.setGroupStyle(ctx, group, 'lineWidth');
  }

  setGroupStyle(ctx, group, styleName) {
    let styleValue = group.styles ? group.styles[styleName] : this.styles[styleName];
    // ctx[styleName] cannot be used to check if styleValue has changed, because
    // when setting ctx.strokeStyle to #000, ctx.strokeStyle evaluates to
    // #000000; we therefore need to store the exact value on a separate object
    if (styleValue !== this.lastRenderedStyles[styleName]) {
      ctx[styleName] = styleValue;
      this.lastRenderedStyles[styleName] = styleValue;
    }
  }

  drawGroups(ctx) {
    this.setGlobalStyles(ctx);
    for (let g = 0; g < this.groups.length; g += 1) {
      let group = this.groups[g];
      let currentX = group.points[0][0];
      let currentY = group.points[0][1];
      this.setGroupStyles(ctx, group);
      if (group.points.length === 1) {
        // Draw a circle
        ctx.fillStyle = group.styles ? group.styles.strokeStyle : this.styles.strokeStyle;
        ctx.beginPath();
        ctx.arc(
          currentX, currentY,
          (group.styles ? group.styles.lineWidth : this.styles.lineWidth) / 2,
          0, Math.PI * 2,
          false
        );
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
    return _.pick(this, ['styles', 'groups', 'undoHistory']);
  }

}
Frame.nextAutoIncrementedId = 0;
Frame.defaultStyles = {
  strokeStyle: '#000',
  lineWidth: 12,
  lineCap: 'round',
  lineJoin: 'round'
};

export default Frame;
