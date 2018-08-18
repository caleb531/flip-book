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

  play() {
    this.playing = true;
    let callback;
    this.playbackTimer = setTimeout(callback = () => {
      this.setSelectedFrame((this.selectedFrameIndex + 1) % this.frames.length);
      this.playbackTimer = setTimeout(callback, this.frameDuration);
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
