class FrameComponent {

    oninit({attrs: {frame}}) {
      this.frame = frame;
      // Store the current number of stroke groups in the frame so we can later
      // detect changes to the same frame
      this.frameGroupCount = frame.groups.length;
      // Store the current number of points in the last stroke group
      this.pointCount = frame.countPointsInLastGroup();
    }

    oncreate({dom}) {
      this.canvas = dom;
      this.ctx = this.canvas.getContext('2d');
      this.lastRenderedStyles = {};
      this.render();
    }

    onupdate({attrs: {frame}}) {
      if (frame !== this.frame || frame.groups.length !== this.frameGroupCount || frame.countPointsInLastGroup() !== this.pointCount) {
        this.frame = frame;
        this.frameGroupCount = frame.groups.length;
        this.pointCount = frame.countPointsInLastGroup();
        this.render();
      }
    }

    render({backgroundColor = null} = {}) {
      this.clearCanvas();
      if (backgroundColor) {
        this.setBackground(backgroundColor);
      }
      if (this.ctx.canvas.width !== FrameComponent.width || this.ctx.canvas.height !== FrameComponent.height) {
        this.scaleCanvas();
      }
      this.drawGroups();
    }

    clearCanvas() {
      this.ctx.resetTransform();
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    scaleCanvas() {
      this.ctx.scale(this.ctx.canvas.width / FrameComponent.width, this.ctx.canvas.height / FrameComponent.height);
    }

    setBackground(backgroundColor) {
      this.ctx.fillStyle = backgroundColor;
      this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.ctx.fillStyle = 'transparent';
    }

    setGlobalStyles() {
      this.ctx.lineCap = this.frame.styles.lineCap;
      this.ctx.lineJoin = this.frame.styles.lineJoin;
    }

    setGroupStyles(group) {
      // TODO: implement the ability to change stroke color within the UI; the
      // below line isn't needed until that is done
      // this.setGroupStyle(group, 'strokeStyle');
      this.setGroupStyle(group, 'lineWidth');
    }

    setGroupStyle(group, styleName) {
      let styleValue = group.styles ? group.styles[styleName] : this.frame.styles[styleName];
      // this.ctx[styleName] cannot be used to check if styleValue has changed, because
      // when setting this.ctx.strokeStyle to #000, this.ctx.strokeStyle evaluates to
      // #000000; we therefore need to store the exact value on a separate object
      if (styleValue !== this.lastRenderedStyles[styleName]) {
        this.ctx[styleName] = styleValue;
        this.lastRenderedStyles[styleName] = styleValue;
      }
    }

    drawGroups() {
      this.setGlobalStyles();
      for (let g = 0; g < this.frame.groups.length; g += 1) {
        let group = this.frame.groups[g];
        let currentX = group.points[0][0];
        let currentY = group.points[0][1];
        this.setGroupStyles(group);
        if (group.points.length === 1) {
          // Draw a circle
          this.ctx.fillStyle = group.styles ? group.styles.strokeStyle : this.frame.styles.strokeStyle;
          this.ctx.beginPath();
          this.ctx.arc(
            currentX, currentY,
            (group.styles ? group.styles.lineWidth : this.frame.styles.lineWidth) / 2,
            0, Math.PI * 2,
            false
          );
          this.ctx.fill();
          this.ctx.closePath();
          this.ctx.fillStyle = 'transparent';
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

    view({attrs: {className, width = FrameComponent.width, height = FrameComponent.height}}) {
      return m('canvas', {
        class: className,
        width,
        height
      });
    }

}
FrameComponent.width = 1600;
FrameComponent.height = 900;

export default FrameComponent;
