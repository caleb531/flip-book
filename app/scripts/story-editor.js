import DrawingArea from './drawing-area.js';
import Frame from './frame.js';

class StoryEditor {

  constructor() {
    this.frames = [new Frame()];
    this.selectedFrameIndex = 0;
    this.drawingArea = new DrawingArea({
      canvas: document.querySelector('.current-frame'),
      frame: this.getSelectedFrame()
    });
    this.bindControlEvents();
  }

  getSelectedFrame() {
    return this.frames[this.selectedFrameIndex];
  }

  setSelectedFrame(newIndex) {
    this.selectedFrameIndex = newIndex;
    this.drawingArea.frame = this.getSelectedFrame();
    this.drawingArea.render();
  }

  bindControlEvents() {
    document.querySelector('.control-prev-frame').addEventListener('click', () => {
      if (this.selectedFrameIndex > 0) {
        this.selectedFrameIndex -= 1;
        this.drawingArea.frame = this.getSelectedFrame();
        this.drawingArea.render();
      }
    });
    document.querySelector('.control-next-frame').addEventListener('click', () => {
      if (this.selectedFrameIndex < (this.frames.length - 1)) {
        this.selectedFrameIndex += 1;
        this.drawingArea.frame = this.getSelectedFrame();
        this.drawingArea.render();
      }
    });
    document.querySelector('.control-new-frame').addEventListener('click', () => {
      this.frames.splice(this.selectedFrameIndex + 1, 0, new Frame());
      this.setSelectedFrame(this.selectedFrameIndex + 1);
    });
    document.querySelector('.control-undo').addEventListener('click', () => {
      this.drawingArea.undo();
    });
    document.querySelector('.control-redo').addEventListener('click', () => {
      this.drawingArea.redo();
    });
  }

}

export default StoryEditor;
