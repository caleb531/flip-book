import Frame from './frame.js';

class Story {

  constructor({frames = [new Frame()], frameDuration = 100, showPreviousFrame = true, selectedFrameIndex = 0} = {}) {
    this.frames = frames.map((frame) => new Frame(frame));
    this.selectFrame(selectedFrameIndex);
    this.frameDuration = frameDuration;
    this.showPreviousFrame = showPreviousFrame;
    this.playing = false;
  }

  getSelectedFrame() {
    return this.frames[this.selectedFrameIndex];
  }

  selectFrame(newIndex) {
    this.selectedFrameIndex = newIndex;
  }

  getPreviousFrame() {
    if (this.frames.length > 0) {
      return this.frames[this.selectedFrameIndex - 1];
    } else {
      return null;
    }
  }

  selectPreviousFrame() {
    if (this.selectedFrameIndex > 0) {
      this.selectFrame(this.selectedFrameIndex - 1);
    }
  }

  selectNextFrame() {
    if (this.selectedFrameIndex < (this.frames.length - 1)) {
      this.selectFrame(this.selectedFrameIndex + 1);
    }
  }

  addFrame() {
    this.frames.splice(this.selectedFrameIndex + 1, 0, new Frame());
    this.selectFrame(this.selectedFrameIndex + 1);
  }

  removeSelectedFrame() {
    if (this.frames.length === 1) {
      this.frames.splice(this.selectedFrameIndex, 1, new Frame());
    } else {
      this.frames.splice(this.selectedFrameIndex, 1);
      if (this.selectedFrameIndex === this.frames.length) {
        this.selectFrame(this.selectedFrameIndex - 1);
      } else {
        this.selectFrame(this.selectedFrameIndex);
      }
    }
  }

  play(onNextFrame) {
    this.playing = true;
    let callback;
    this.playbackTimer = setTimeout(callback = () => {
      this.selectFrame((this.selectedFrameIndex + 1) % this.frames.length);
      this.playbackTimer = setTimeout(callback, this.frameDuration);
      if (onNextFrame) {
        onNextFrame();
      }
    }, this.frameDuration);
  }

  pause() {
    this.playing = false;
    clearTimeout(this.playbackTimer);
  }

  undo() {
    this.getSelectedFrame().undo();
  }

  redo() {
    this.getSelectedFrame().redo();
  }

  export({width, height, progress = null, success = null}) {
    this.gifGenerator = new GIF({
      workers: 2,
      workerScript: 'scripts/gif.worker.js'
    });
    this.frames.forEach((frame) => {
      let canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      frame.render(canvas.getContext('2d'), {
        backgroundColor: '#fff'
      });
      this.gifGenerator.addFrame(canvas, {delay: this.frameDuration});
    });
    this.gifGenerator.on('progress', (currentProgress) => {
      this.exportProgress = currentProgress;
      if (progress) {
        progress();
      }
    });
    this.gifGenerator.on('finished', (blob) => {
      let image = new Image();
      image.onload = () => {
        this.exportedImageUrl = image.src;
        if (success) {
          success();
        }
      };
      image.src = URL.createObjectURL(blob);
    });
    this.exportedImageUrl = null;
    this.gifGenerator.render();
  }

  isExporting() {
    if (this.gifGenerator) {
      return this.gifGenerator.running;
    } else {
      return false;
    }
  }

  exportIsFinished() {
    if (this.gifGenerator) {
      return this.gifGenerator.finishedFrames === this.frames.length;
    } else {
      return false;
    }
  }

  abortExport() {
    if (this.gifGenerator) {
      this.gifGenerator.abort();
      this.gifGenerator = false;
    }
  }

  toJSON() {
    return _.pick(this, [
      'frames',
      'selectedFrameIndex',
      'frameDuration',
      'showPreviousFrame'
    ]);
  }

}

export default Story;
