import DrawingArea from './drawing-area.js';
import Frame from './frame.js';

class StoryEditor {

  constructor() {
    this.frames = [new Frame()];
    this.selectedFrameIndex = 0;

    this.previousFrameCanvas = document.querySelector('.previous-frame');
    this.selectedFrameCanvas = document.querySelector('.selected-frame');

    this.timelineElement = document.querySelector('.frame-timeline');
    this.timelineThumbnailCanvases = [];

    this.drawingArea = new DrawingArea({
      canvas: this.selectedFrameCanvas,
      frame: this.getSelectedFrame(),
      onEndDraw: () => {
        let thumbnailCanvas = this.timelineThumbnailCanvases[this.selectedFrameIndex];
        this.getSelectedFrame().render(thumbnailCanvas.getContext('2d'), {
          scale: thumbnailCanvas.width / this.selectedFrameCanvas.width
        });
      }
    });

    this.bindControlEvents();
    this.initializeTimeline();
  }

  getSelectedFrame() {
    return this.frames[this.selectedFrameIndex];
  }

  setSelectedFrame(newIndex) {
    this.selectedFrameIndex = newIndex;
    this.drawingArea.frame = this.getSelectedFrame();
    this.drawingArea.render();
    this.renderPreviousFrame();
    this.setSelectedTimelineThumbnail();
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
      this.addTimelineThumbnail(this.selectedFrameIndex + 1);
      this.setSelectedFrame(this.selectedFrameIndex + 1);
    });
    document.querySelector('.frame-timeline').addEventListener('click', (event) => {
      if (event.target.classList.contains('timeline-thumbnail')) {
        this.setSelectedFrame(Number(event.target.getAttribute('data-index')));
      }
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

  initializeTimeline() {
    for (let f = 0; f < this.frames.length; f += 1) {
      this.addTimelineThumbnail(f + 1);
    }
    this.setSelectedTimelineThumbnail();
  }

  addTimelineThumbnail(newCanvasIndex) {
    let canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 72;
    canvas.classList.add('timeline-thumbnail');
    this.timelineElement.insertBefore(canvas, this.timelineThumbnailCanvases[newCanvasIndex]);
    this.timelineThumbnailCanvases.splice(newCanvasIndex, 0, canvas);
  }

  setSelectedTimelineThumbnail() {
    for (let t = 0; t < this.timelineThumbnailCanvases.length; t += 1) {
      this.timelineThumbnailCanvases[t].setAttribute('data-index', t);
      this.timelineThumbnailCanvases[t].classList.remove('selected');
    }
    let selectedCanvas = this.timelineThumbnailCanvases[this.selectedFrameIndex];
    selectedCanvas.classList.add('selected');
    selectedCanvas.scrollIntoView({
      block: 'nearest'
    });
  }

}

export default StoryEditor;
