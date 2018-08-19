import Frame from './frame.js';

class Story {

  constructor({frames = [new Frame()], frameDuration = 100, showPreviousFrame = true, selectedFrameIndex = 0} = {}) {
    this.frames = frames.map((frame) => new Frame(frame));
    this.setSelectedFrame(selectedFrameIndex);
    this.frameDuration = frameDuration;
    this.showPreviousFrame = showPreviousFrame;
    this.playing = false;
  }

  getSelectedFrame() {
    return this.frames[this.selectedFrameIndex];
  }

  setSelectedFrame(newIndex) {
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
      this.setSelectedFrame(this.selectedFrameIndex - 1);
    }
  }

  selectNextFrame() {
    if (this.selectedFrameIndex < (this.frames.length - 1)) {
      this.setSelectedFrame(this.selectedFrameIndex + 1);
    }
  }

  addFrame() {
    this.frames.splice(this.selectedFrameIndex + 1, 0, new Frame());
    this.setSelectedFrame(this.selectedFrameIndex + 1);
  }

  removeSelectedFrame() {
    if (this.frames.length === 1) {
      this.frames.splice(this.selectedFrameIndex, 1, new Frame());
    } else {
      this.frames.splice(this.selectedFrameIndex, 1);
      if (this.selectedFrameIndex === this.frames.length) {
        this.setSelectedFrame(this.selectedFrameIndex - 1);
      } else {
        this.setSelectedFrame(this.selectedFrameIndex);
      }
    }
  }

  play(onNextFrame) {
    this.playing = true;
    let callback;
    this.playbackTimer = setTimeout(callback = () => {
      this.setSelectedFrame((this.selectedFrameIndex + 1) % this.frames.length);
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
