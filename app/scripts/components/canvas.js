class CanvasComponent {

    oninit({attrs: {frame}}) {
      this.frame = frame;
    }

    oncreateSelectedFrame({dom}) {
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

    view({attrs}) {
      return m('canvas', Object.assign(attrs, {
        oncreate: (vnode) => this.oncreateSelectedFrame(vnode)
      }));
    }

}

export default CanvasComponent;
