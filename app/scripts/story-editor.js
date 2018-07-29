import DrawingArea from './drawing-area.js';
import Frame from './frame.js';

class StoryEditor {

  constructor() {
    this.drawingArea = new DrawingArea({
      canvas: document.querySelector('.current-frame'),
      frame: new Frame()
    });
    this.bindControlEvents();
  }

  bindControlEvents() {
    document.querySelector('.control-undo').addEventListener('click', () => {
      this.drawingArea.undo();
    });
    document.querySelector('.control-redo').addEventListener('click', () => {
      this.drawingArea.redo();
    });
  }

}

export default StoryEditor;
