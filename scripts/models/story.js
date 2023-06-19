import _ from 'underscore';
import Frame from './frame.js';
import StoryMetadata from './story-metadata.js';
import appStorage from './app-storage.js';

class Story {

  constructor({frames = [new Frame()], frameDuration = 100, showPreviousFrame = null, numPreviousFramesToShow = 1, selectedFrameIndex = 0, metadata = {}, frameStyles, exportedGifSize = 1080} = {}) {
    this.frames = frames.map((frame) => new Frame(frame));
    this.selectFrame(selectedFrameIndex);
    this.frameDuration = frameDuration;
    if (showPreviousFrame !== null) {
      this.numPreviousFramesToShow = Number(showPreviousFrame);
    } else {
      this.numPreviousFramesToShow = numPreviousFramesToShow;
    }
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

  getPreviousFramesToShow() {
    // The returned array is ordered according to the original order of the
    // frames in the frames array
    return this.frames.slice(Math.max(0, this.selectedFrameIndex - this.numPreviousFramesToShow), this.selectedFrameIndex);
  }

  selectPreviousFrame() {
    this.selectFrame((this.selectedFrameIndex - 1 + this.frames.length) % this.frames.length);
  }

  selectNextFrame() {
    this.selectFrame((this.selectedFrameIndex + 1) % this.frames.length);
  }

  addNewFrame() {
    this.frames.splice(this.selectedFrameIndex + 1, 0, new Frame());
    this.selectFrame(this.selectedFrameIndex + 1);
  }

  duplicateCurrentFrame() {
    this.frames.splice(this.selectedFrameIndex + 1, 0, new Frame(this.getSelectedFrame()));
    this.selectFrame(this.selectedFrameIndex + 1);
  }

  deleteSelectedFrame() {
    if (this.frames.length === 1) {
      this.frames.splice(this.selectedFrameIndex, 1, new Frame());
    } else {
      this.frames.splice(this.selectedFrameIndex, 1);
      this.selectFrame(Math.max(0, this.selectedFrameIndex - 1));
    }
  }

  moveFrame(oldFrameIndex, newFrameIndex) {
    let frame = this.frames[oldFrameIndex];
    this.frames.splice(oldFrameIndex, 1);
    this.frames.splice(newFrameIndex, 0, frame);
  }

  getFramesPerSecond() {
    return Math.round(Story.MS_IN_S / this.frameDuration);
  }

  setFramesPerSecond(framesPerSecond) {
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

  async save() {
    await appStorage.set(`flipbook-story-${this.metadata.createdDate}`, this);
  }

  toJSON() {
    return _.pick(this, [
      'frames',
      'selectedFrameIndex',
      'frameDuration',
      'numPreviousFramesToShow',
      'frameStyles',
      'exportedGifSize'
    ]);
  }

}
// The number of milliseconds in one second
Story.MS_IN_S = 1000;

// The maximum number of previous frames to show
Story.maxPreviousFramesToShow = 5;

export default Story;
