import DrawingArea from './drawing-area.js';
import Frame from './frame.js';

class StoryEditor {

  constructor({editorElement, frames, selectedFrameIndex = 0}) {
    this.editorElement = editorElement;
    if (frames) {
      this.frames = frames.map((frame) => new Frame(frame));
    } else {
       this.frames = [new Frame()];
    }
    this.selectedFrameIndex = selectedFrameIndex;
    this.frameDuration = 500;

    this.previousFrameCanvas = this.querySelector('.previous-frame');
    this.selectedFrameCanvas = this.querySelector('.selected-frame');

    this.timelineElement = this.querySelector('.frame-timeline');
    this.timelineThumbnailCanvases = [];

    this.drawingArea = new DrawingArea({
      canvas: this.selectedFrameCanvas,
      frame: this.getSelectedFrame(),
      onEndDraw: () => {
        this.renderSelectedThumbnail();
        this.save();
      }
    });

    this.bindControlEvents();
    this.initializeTimeline();
    this.setSelectedFrame(this.selectedFrameIndex);
  }

  querySelector(selector) {
    return this.editorElement.querySelector(selector);
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

  getSelectedTimelineThumbnailCanvas() {
    return this.timelineThumbnailCanvases[this.selectedFrameIndex];
  }

  bindControlEvents() {
    this.querySelector('.control-skip-to-first-frame').addEventListener('click', () => {
      this.setSelectedFrame(0);
      this.save();
    });
    this.querySelector('.control-play-story').addEventListener('click', () => {
      this.playStory();
    });
    this.querySelector('.control-pause-story').addEventListener('click', () => {
      this.pauseStory();
    });
    this.querySelector('.control-prev-frame').addEventListener('click', () => {
      if (this.selectedFrameIndex > 0) {
        this.setSelectedFrame(this.selectedFrameIndex - 1);
        this.save();
      }
    });
    this.querySelector('.control-next-frame').addEventListener('click', () => {
      if (this.selectedFrameIndex < (this.frames.length - 1)) {
        this.setSelectedFrame(this.selectedFrameIndex + 1);
        this.save();
      }
    });
    this.querySelector('.control-add-frame').addEventListener('click', () => {
      this.frames.splice(this.selectedFrameIndex + 1, 0, new Frame());
      this.addTimelineThumbnail(this.selectedFrameIndex + 1);
      this.setSelectedFrame(this.selectedFrameIndex + 1);
      this.save();
    });
    this.querySelector('.control-remove-frame').addEventListener('click', () => {
      if (this.frames.length === 1) {
        this.drawingArea.reset();
        this.renderSelectedThumbnail(this.selectedFrameIndex);
      } else {
        this.frames.splice(this.selectedFrameIndex, 1);
        this.removeTimelineThumbnail(this.selectedFrameIndex);
        if (this.selectedFrameIndex === this.frames.length) {
          this.setSelectedFrame(this.selectedFrameIndex - 1);
        } else {
          this.setSelectedFrame(this.selectedFrameIndex);
        }
      }
      this.save();
    });
    this.querySelector('.frame-timeline').addEventListener('click', (event) => {
      if (event.target.classList.contains('timeline-thumbnail')) {
        this.setSelectedFrame(Number(event.target.getAttribute('data-index')));
        this.save();
      }
    });
    this.querySelector('.control-undo').addEventListener('click', () => {
      this.drawingArea.undo();
    });
    this.querySelector('.control-redo').addEventListener('click', () => {
      this.drawingArea.redo();
    });
  }

  playStory() {
    let callback;
    this.editorElement.classList.add('story-playing');
    this.playbackTimer = setTimeout(callback = () => {
      if ((this.selectedFrameIndex + 1) < this.frames.length) {
        this.setSelectedFrame(this.selectedFrameIndex + 1);
        this.playbackTimer = setTimeout(callback, this.frameDuration);
      } else {
        this.pauseStory();
      }
    }, this.frameDuration);
  }

  pauseStory() {
    this.editorElement.classList.remove('story-playing');
    clearTimeout(this.playbackTimer);
  }

  renderPreviousFrame() {
    if (this.selectedFrameIndex === 0) {
      this.previousFrameCanvas.classList.remove('visible');
    } else {
      this.previousFrameCanvas.classList.add('visible');
      this.frames[this.selectedFrameIndex - 1].render(this.previousFrameCanvas.getContext('2d'));
    }
  }

  renderSelectedThumbnail() {
    let thumbnailCanvas = this.getSelectedTimelineThumbnailCanvas();
    this.getSelectedFrame().render(thumbnailCanvas.getContext('2d'), {
      scale: thumbnailCanvas.width / this.selectedFrameCanvas.width
    });
  }

  renderThumbnail(frameIndex) {
    let thumbnailCanvas = this.timelineThumbnailCanvases[frameIndex];
    this.frames[frameIndex].render(thumbnailCanvas.getContext('2d'), {
      scale: thumbnailCanvas.width / this.selectedFrameCanvas.width
    });
  }

  initializeTimeline() {
    for (let f = 0; f < this.frames.length; f += 1) {
      this.addTimelineThumbnail(f + 1);
      this.renderThumbnail(f);
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

  removeTimelineThumbnail(canvasIndex) {
    this.timelineThumbnailCanvases[canvasIndex].remove();
    this.timelineThumbnailCanvases.splice(canvasIndex, 1);
  }

  setSelectedTimelineThumbnail() {
    for (let t = 0; t < this.timelineThumbnailCanvases.length; t += 1) {
      this.timelineThumbnailCanvases[t].setAttribute('data-index', t);
      this.timelineThumbnailCanvases[t].classList.remove('selected');
    }
    let selectedCanvas = this.getSelectedTimelineThumbnailCanvas();
    selectedCanvas.classList.add('selected');
    selectedCanvas.scrollIntoView({
      block: 'nearest'
    });
  }

  toJSON() {
    return {
      frames: this.frames,
      selectedFrameIndex: this.selectedFrameIndex
    };
  }

  save() {
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => {
      localStorage.setItem('flipbook-story', JSON.stringify(this));
    }, StoryEditor.saveDelay);
  }

}

StoryEditor.saveDelay = 500;

StoryEditor.restore = function ({editorElement}) {
    let editorJson = JSON.parse(localStorage.getItem('flipbook-story'));
    return new StoryEditor(Object.assign(editorJson || {}, {editorElement}));
};

export default StoryEditor;
