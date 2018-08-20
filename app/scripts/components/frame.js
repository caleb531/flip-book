class FrameComponent {

    oninit({attrs}) {
      this.frame = attrs.frame;
      console.log(attrs.class, 'INIT');
    }

    oncreate({dom}) {
      console.log(dom.className, 'CREATE');
      this.canvas = dom;
      this.ctx = this.canvas.getContext('2d');
      this.canvasScaleFactor = this.canvas.width / this.canvas.offsetWidth;
      this.renderCanvas();
    }

    onupdate({attrs: {frame}}) {
      console.log(this.canvas.className, 'UPDATE');
      if (frame !== this.frame) {
        this.frame = frame;
        this.renderCanvas();
      }
    }

    renderCanvas() {
      this.frame.render(this.ctx);
    }

    view({attrs}) {
      return m('canvas', attrs);
    }

}
FrameComponent.width = 1600;
FrameComponent.height = 900;

export default FrameComponent;
