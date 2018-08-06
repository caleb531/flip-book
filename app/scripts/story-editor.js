import DrawingArea from './drawing-area.js';
import Frame from './frame.js';

class StoryEditor {

  constructor({editorElement, frames, frameDuration = 500, showPreviousFrame = false, selectedFrameIndex = 0}) {
    this.editorElement = editorElement;
    if (frames) {
      this.frames = frames.map((frame) => new Frame(frame));
    } else {
      this.frames = [new Frame()];
    }
    this.selectedFrameIndex = selectedFrameIndex;

    this.frameDurationValueElement = this.querySelector('.setting-value-frame-duration');
    this.updateFrameDuration(frameDuration, {initialize: true});
    this.updateShowPreviousFrame(showPreviousFrame, {initialize: true});

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
    this.exportScreenElement = this.querySelector('.export-screen');
    this.exportHeadingElement = this.querySelector('.export-heading');
    this.exportMessageElement = this.querySelector('.export-message');

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

  updateFrameDuration(frameDuration, {initialize} = {}) {
    this.frameDuration = frameDuration;
    let frameDurationSeconds = frameDuration / 1000;
    let formattedDurationSeconds;
    if (frameDurationSeconds > 0 && frameDurationSeconds < 1) {
      formattedDurationSeconds = frameDurationSeconds.toPrecision(1);
    } else {
      formattedDurationSeconds = frameDurationSeconds.toPrecision(2);
    }
    this.frameDurationValueElement.innerText = `${formattedDurationSeconds}s`;
    if (initialize) {
      this.querySelector('.setting-frame-duration').value = frameDuration;
    }
    this.save();
  }

  updateShowPreviousFrame(showPreviousFrame, {initialize} = {}) {
    this.showPreviousFrame = showPreviousFrame;
    if (initialize) {
      this.querySelector('.setting-show-previous-frame').checked = showPreviousFrame;
    }
    this.save();
  }

  bindControlEvents() {
    this.querySelector('.control-export-to-gif').addEventListener('click', () => {
      this.exportToGIF();
    });
    this.querySelector('.export-overlay').addEventListener('click', () => {
      this.gifGenerator.abort();
      this.exportScreenElement.classList.remove('visible');
    });
    this.querySelector('.control-settings').addEventListener('click', () => {
      this.editorElement.classList.toggle('settings-open');
    });
    this.querySelector('.setting-frame-duration').addEventListener('input', (event) => {
      this.updateFrameDuration(Number(event.target.value));
      this.drawingArea.render();
    });
    this.querySelector('.setting-show-previous-frame').addEventListener('change', (event) => {
      this.updateShowPreviousFrame(event.target.checked);
      this.renderPreviousFrame();
    });
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
    this.querySelector('.control-delete-frame').addEventListener('click', () => {
      if (!confirm('Are you sure you want to delete this frame?')) {
        return;
      }
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

  exportToGIF() {
    let existingExportedGif = this.exportScreenElement.querySelector('.exported-gif');
    if (existingExportedGif) {
      existingExportedGif.remove();
    }
    this.gifGenerator = new GIF({
      workers: 2,
      workerScript: 'scripts/gif.worker.js'
    });
    for (let f = 0; f < this.frames.length; f += 1) {
      let canvas = document.createElement('canvas');
      canvas.width = this.selectedFrameCanvas.width;
      canvas.height = this.selectedFrameCanvas.height;
      this.frames[f].render(canvas.getContext('2d'), {
        backgroundColor: '#fff'
      });
      this.gifGenerator.addFrame(canvas, {delay: this.frameDuration});
    }
    this.gifGenerator.on('finished', (blob) => {
      let imageUrl = URL.createObjectURL(blob);
      let image = new Image();
      let callback;
      image.addEventListener('load', callback = () => {
        image.removeEventListener('load', callback);
        this.exportScreenElement.append(image);
      });
      image.classList.add('exported-gif');
      image.src = imageUrl;
      this.exportScreenElement.classList.remove('loading');
      this.exportScreenElement.classList.add('loaded');
      this.exportHeadingElement.innerText = 'GIF Generated!';
      this.exportMessageElement.innerText = 'Right-click the image and choose "Save Image As..." to download.';
    });

    this.exportScreenElement.classList.add('visible', 'loading');
    this.exportHeadingElement.classList.add('visible', 'loading');
    this.exportHeadingElement.innerText = 'Generating GIF...';
    this.gifGenerator.render();

  }

  playStory() {
    let callback;
    this.editorElement.classList.add('story-playing');
    this.drawingArea.drawingEnabled = false;
    this.playbackTimer = setTimeout(callback = () => {
      this.setSelectedFrame((this.selectedFrameIndex + 1) % this.frames.length);
      this.playbackTimer = setTimeout(callback, this.frameDuration);
    }, this.frameDuration);
  }

  pauseStory() {
    this.editorElement.classList.remove('story-playing');
    this.drawingArea.drawingEnabled = true;
    clearTimeout(this.playbackTimer);
  }

  renderPreviousFrame() {
    if (this.selectedFrameIndex === 0 || !this.showPreviousFrame) {
      this.previousFrameCanvas.classList.remove('visible');
    } else if (this.showPreviousFrame) {
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
  }

  addTimelineThumbnail(newThumbnailIndex) {
    let container = document.createElement('div');
    container.classList.add('timeline-thumbnail');
    let canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 72;
    canvas.classList.add('timeline-thumbnail-canvas');
    container.append(canvas);
    let currentThumbnailCanvas = this.timelineThumbnailCanvases[newThumbnailIndex];
    this.timelineElement.insertBefore(container, currentThumbnailCanvas ? currentThumbnailCanvas.parentElement : null);
    this.timelineThumbnailCanvases.splice(newThumbnailIndex, 0, canvas);
  }

  removeTimelineThumbnail(thumbnailIndex) {
    this.timelineThumbnailCanvases[thumbnailIndex].parentElement.remove();
    this.timelineThumbnailCanvases.splice(thumbnailIndex, 1);
  }

  setSelectedTimelineThumbnail() {
    for (let t = 0; t < this.timelineThumbnailCanvases.length; t += 1) {
      let thumbnailCanvas = this.timelineThumbnailCanvases[t];
      thumbnailCanvas.parentElement.setAttribute('data-index', t);
      thumbnailCanvas.parentElement.classList.remove('selected');
    }
    let selectedCanvas = this.getSelectedTimelineThumbnailCanvas();
    selectedCanvas.parentElement.classList.add('selected');
    this.scrollThumbnailIntoView(selectedCanvas);
  }

  scrollThumbnailIntoView(thumbnailCanvas) {
    let thumbnailContainer = thumbnailCanvas.parentElement;
    let scrollLeft = this.timelineElement.scrollLeft;
    let scrollRight = scrollLeft + this.timelineElement.offsetWidth;
    let offsetLeft = thumbnailContainer.offsetLeft;
    let offsetRight = thumbnailContainer.offsetLeft + thumbnailContainer.offsetWidth;

    if (offsetRight > scrollRight) {
      this.timelineElement.scrollLeft += offsetRight - scrollRight;
    } else if (offsetLeft < scrollLeft) {
      this.timelineElement.scrollLeft += offsetLeft - scrollLeft;
    }

  }

  toJSON() {
    return {
      frames: this.frames,
      selectedFrameIndex: this.selectedFrameIndex,
      frameDuration: this.frameDuration,
      showPreviousFrame: this.showPreviousFrame
    };
  }

  save() {
    clearTimeout(this.autosaveTimer);
    this.autosaveTimer = setTimeout(() => {
      localStorage.setItem('flipbook-story', JSON.stringify(this));
    }, StoryEditor.saveDelay);
  }

}

StoryEditor.saveDelay = 250;

StoryEditor.restore = function ({editorElement}) {
    let editorJson = JSON.parse(localStorage.getItem('flipbook-story'));
    return new StoryEditor(Object.assign(editorJson || {}, {editorElement}));
};

export default StoryEditor;
