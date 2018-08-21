class FrameComponent {

    oninit({attrs: {frame}}) {
      this.frame = frame;
    }

    oncreate({dom}) {
      this.canvas = dom;
      this.ctx = this.canvas.getContext('2d');
      this.canvasScaleFactor = this.canvas.width / this.canvas.offsetWidth;
      this.renderCanvas();
    }

    onupdate({attrs: {frame}}) {
      if (frame !== this.frame) {
        this.frame = frame;
        this.renderCanvas();
      }
    }

    renderCanvas() {
      this.frame.render(this.ctx);
    }

    view({attrs: {className}}) {
      return m('canvas', {
        class: className,
        width: FrameComponent.width,
        height: FrameComponent.height
      });
    }

}
FrameComponent.width = 1600;
FrameComponent.height = 900;

export default FrameComponent;
