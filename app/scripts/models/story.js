import Frame from './frame.js';
import StoryMetadata from './story-metadata.js';

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
