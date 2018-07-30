import DrawingArea from './drawing-area.js';
import Frame from './frame.js';

class StoryEditor {

  constructor() {
    this.frames = [new Frame()];
    this.selectedFrameIndex = 0;
    this.previousFrameCanvas = document.querySelector('.previous-frame');
    this.currentFrameCanvas = document.querySelector('.current-frame');
    this.drawingArea = new DrawingArea({
      canvas: this.currentFrameCanvas,
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
    this.renderPreviousFrame();
  }

  bindControlEvents() {
    document.querySelector('.control-prev-frame').addEventListener('click', () => {
      if (this.selectedFrameIndex > 0) {
        this.setSelectedFrame(this.selectedFrameIndex - 1);
      }
    });
    document.querySelector('.control-next-frame').addEventListener('click', () => {
      if (this.selectedFrameIndex < (this.frames.length - 1)) {
        this.setSelectedFrame(this.selectedFrameIndex + 1);
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

  renderPreviousFrame() {
    if (this.selectedFrameIndex === 0) {
      this.previousFrameCanvas.classList.remove('visible');
    } else {
      this.previousFrameCanvas.classList.add('visible');
      this.frames[this.selectedFrameIndex - 1].render(this.previousFrameCanvas.getContext('2d'));
    }
  }

}

export default StoryEditor;
