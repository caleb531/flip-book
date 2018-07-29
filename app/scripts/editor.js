import EditableCanvas from './editable-canvas.js';

class Editor {

  constructor() {
    this.editableCanvas = new EditableCanvas({
      canvas: document.querySelector('.current-frame')
    });
    this.bindControlEvents();
  }

  bindControlEvents() {
    document.querySelector('.control-undo').addEventListener('click', () => {
      this.editableCanvas.undo();
    });
    document.querySelector('.control-redo').addEventListener('click', () => {
      this.editableCanvas.redo();
    });
  }

}

export default Editor;
