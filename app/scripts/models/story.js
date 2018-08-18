import Frame from './frame.js';

class Story {

  constructor({frames, frameDuration, showPreviousFrame, selectedFrameIndex}) {
    this.frames = frames.map((frame) => new Frame(frame));
    this.setSelectedFrame(selectedFrameIndex);
    this.frameDuration = frameDuration;
    this.showPreviousFrame = showPreviousFrame;
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
    let callback;
    this.playbackTimer = setTimeout(callback = () => {
      this.setSelectedFrame((this.selectedFrameIndex + 1) % this.frames.length);
      this.playbackTimer = setTimeout(callback, this.frameDuration);
    }, this.frameDuration);
  }

  pause() {
    clearTimeout(this.playbackTimer);
  }

  toJSON() {
    return {
      frames: this.frames,
      selectedFrameIndex: this.selectedFrameIndex,
      frameDuration: this.frameDuration,
      showPreviousFrame: this.showPreviousFramel
    };
  }

}

export default Story;
