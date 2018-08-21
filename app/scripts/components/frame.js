class FrameComponent {

    oninit({attrs: {frame}}) {
      this.frame = frame;
      // Store the current number of stroke groups in the frame so we can later
      // detect changes to the same frame
      this.frameGroupCount = frame.groups.length;
    }

    oncreate({dom}) {
      this.canvas = dom;
      this.ctx = this.canvas.getContext('2d');
      this.canvasScaleFactor = this.canvas.width / this.canvas.offsetWidth;
      this.renderCanvas();
    }

    onupdate({attrs: {frame}}) {
      if (frame !== this.frame || frame.groups.length !== this.frameGroupCount) {
        this.frame = frame;
        this.renderCanvas();
      }
    }

    renderCanvas() {
      this.frame.render(this.ctx, {
        scale: this.canvas.width / FrameComponent.width
      });
    }

    view({attrs: {className, width = FrameComponent.width, height = FrameComponent.height}}) {
      return m('canvas', {
        class: className,
        width: width,
        height: height
      });
    }

}
FrameComponent.width = 1600;
FrameComponent.height = 900;

export default FrameComponent;
