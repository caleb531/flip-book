import Frame from './frame.js';
import StoryMetadata from './story-metadata.js';
import FrameComponent from '../components/frame.js';

class Story {

  constructor({frames = [new Frame()], frameDuration = 100, showPreviousFrame = true, selectedFrameIndex = 0, metadata = {}, frameStyles, exportedGifSize = 1} = {}) {
    this.frames = frames.map((frame) => new Frame(frame));
    this.selectFrame(selectedFrameIndex);
    this.frameDuration = frameDuration;
    this.showPreviousFrame = showPreviousFrame;
    this.metadata = new StoryMetadata(metadata);
    this.playing = false;
    this.exportedGifSize = exportedGifSize;
    this.frameStyles = Object.assign({}, {
      strokeStyle: Frame.defaultStyles.strokeStyle,
      lineWidth: Frame.defaultStyles.lineWidth
    }, frameStyles);
  }

  getSelectedFrame() {
    return this.frames[this.selectedFrameIndex];
  }

  selectFrame(newIndex) {
    this.selectedFrameIndex = Math.min(newIndex, this.frames.length - 1);
  }

  getPreviousFrame() {
    if (this.frames.length > 0) {
      return this.frames[this.selectedFrameIndex - 1];
    } else {
      return null;
    }
  }

  selectPreviousFrame() {
    this.selectFrame((this.selectedFrameIndex - 1 + this.frames.length) % this.frames.length);
  }

  selectNextFrame() {
    this.selectFrame((this.selectedFrameIndex + 1) % this.frames.length);
  }

  addFrame() {
    this.frames.splice(this.selectedFrameIndex + 1, 0, new Frame());
    this.selectFrame(this.selectedFrameIndex + 1);
  }

  deleteSelectedFrame() {
    if (this.frames.length === 1) {
      this.frames.splice(this.selectedFrameIndex, 1, new Frame());
    } else {
      this.frames.splice(this.selectedFrameIndex, 1);
      if (this.selectedFrameIndex === 0) {
        this.selectFrame(this.selectedFrameIndex);
      } else {
        this.selectFrame(this.selectedFrameIndex - 1);
      }
    }
  }

  moveFrame(oldFrameIndex, newFrameIndex) {
    let frame = this.frames[oldFrameIndex];
    this.frames.splice(oldFrameIndex, 1);
    this.frames.splice(newFrameIndex, 0, frame);
  }

  getFPS() {
    return Math.round(Story.MS_IN_S / this.frameDuration);
  }

  setFrameDurationFromFPS(framesPerSecond) {
    this.frameDuration = Story.MS_IN_S / framesPerSecond;
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

  exportGif({scale = 1, progress = null, success = null}) {
    this.gifGenerator = new GIF({
      workers: 2,
      workerScript: 'scripts/gif.worker.js'
    });
    this.frames.forEach((frame) => {
      let canvas = document.createElement('canvas');
      canvas.width = FrameComponent.width * scale;
      canvas.height = FrameComponent.height * scale;
      frame.render(canvas.getContext('2d'), {
        scale: scale,
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

  isExportingGif() {
    if (this.gifGenerator) {
      return this.gifGenerator.running;
    } else {
      return false;
    }
  }

  isGifExportFinished() {
    if (this.gifGenerator) {
      return this.gifGenerator.finishedFrames === this.frames.length;
    } else {
      return false;
    }
  }

  abortGifExport() {
    if (this.gifGenerator) {
      this.gifGenerator.abort();
      this.gifGenerator = false;
    }
  }

  exportProject() {
    // The story metadata is not returned by toJSON() so that the information is
    // not duplicated in localStorage (the story metadata is already stored in
    // the app manifest); reconstruct the object with the metadata key added
    // first, since ES6 preserves object key order
    let json = Object.assign({metadata: this.metadata}, this.toJSON());
    // When we import the story somewhere else, it would be more convenient for
    // the first frame to be selected
    delete json.selectedFrameIndex;
    return JSON.stringify(json);
  }

  save() {
    localStorage.setItem(`flipbook-story-${this.metadata.createdDate}`, JSON.stringify(this));
  }

  toJSON() {
    return _.pick(this, [
      'frames',
      'selectedFrameIndex',
      'frameDuration',
      'showPreviousFrame',
      'frameStyles',
      'exportedGifSize'
    ]);
  }

}
// The number of milliseconds in one second
Story.MS_IN_S = 1000;

export default Story;
