import Story from '../scripts/models/story.js';
import Frame from '../scripts/models/frame.js';

describe('story model', function () {

  it('should initialize with default arguments', function () {
    let story = new Story();
    expect(story.frames).toHaveLength(1);
    expect(story).toHaveProperty('selectedFrameIndex', 0);
    expect(story).toHaveProperty('frameDuration', 100);
    expect(story).toHaveProperty('numPreviousFramesToShow', 1);
    expect(story.metadata).toHaveProperty('name', 'My First Story');
    expect(story).toHaveProperty('playing', false);
    expect(story).toHaveProperty('exportedGifSize', 1080);
    expect(story.frameStyles).toHaveProperty('strokeStyle', '#000');
    expect(story.frameStyles).toHaveProperty('lineWidth', 12);
  });

  it('should initialize with supplied arguments', function () {
    let createdDate = Date.now();
    let story = new Story({
      frames: [{}, {}],
      selectedFrameIndex: 1,
      frameDuration: 125,
      numPreviousFramesToShow: 2,
      metadata: {
        name: 'My Test Story',
        createdDate: createdDate
      },
      exportedGifSize: 720,
      frameStyles: {
        strokeStyle: '#6c3',
        lineWidth: 8
      }
    });
    expect(story.frames).toHaveLength(2);
    expect(story.frames[0]).toBeInstanceOf(Frame);
    expect(story).toHaveProperty('selectedFrameIndex', 1);
    expect(story).toHaveProperty('frameDuration', 125);
    expect(story).toHaveProperty('numPreviousFramesToShow', 2);
    expect(story.metadata).toHaveProperty('name', 'My Test Story');
    expect(story.metadata).toHaveProperty('createdDate', createdDate);
    expect(story).toHaveProperty('playing', false);
    expect(story).toHaveProperty('exportedGifSize', 720);
    expect(story.frameStyles).toHaveProperty('strokeStyle', '#6c3');
    expect(story.frameStyles).toHaveProperty('lineWidth', 8);
  });

  it('should honor showPreviousFrame when false', function () {
    let story = new Story({showPreviousFrame: false});
    expect(story).toHaveProperty('numPreviousFramesToShow', 0);
  });

  it('should honor showPreviousFrame when true', function () {
    let story = new Story({showPreviousFrame: true});
    expect(story).toHaveProperty('numPreviousFramesToShow', 1);
  });

  it('should select frame', function () {
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame()]
    });
    expect(story.selectedFrameIndex).toEqual(0);
    story.selectFrame(2);
    expect(story.selectedFrameIndex).toEqual(2);
    story.selectFrame(1);
    expect(story.selectedFrameIndex).toEqual(1);
  });

  it('should get selected frame', function () {
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame()],
      selectedFrameIndex: 1
    });
    expect(story.getSelectedFrame()).toEqual(story.frames[1]);
  });

  it('should get last previous frame by default', function () {
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame()],
      selectedFrameIndex: 2,
      numPreviousFramesToShow: 1
    });
    expect(story.getPreviousFramesToShow()).toHaveLength(1);
    expect(story.getPreviousFramesToShow()[0]).toEqual(story.frames[1]);
  });

  it('should get all previous frames', function () {
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame()],
      selectedFrameIndex: 2,
      numPreviousFramesToShow: 2
    });
    expect(story.getPreviousFramesToShow()).toHaveLength(2);
    expect(story.getPreviousFramesToShow()[0]).toEqual(story.frames[0]);
    expect(story.getPreviousFramesToShow()[1]).toEqual(story.frames[1]);
  });

  it('should get as many previous frames even if bound is exceeded', function () {
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame()],
      selectedFrameIndex: 1,
      numPreviousFramesToShow: 2
    });
    expect(story.getPreviousFramesToShow()).toHaveLength(1);
    expect(story.getPreviousFramesToShow()[0]).toEqual(story.frames[0]);
  });

  it('should not wrap around to get previous frame', function () {
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame()]
    });
    expect(story.getPreviousFramesToShow()).toHaveLength(0);
  });

  it('should select next frame', function () {
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame()]
    });
    story.selectNextFrame();
    expect(story.getSelectedFrame()).toEqual(story.frames[1]);
  });

  it('should wrap around when selecting next frame', function () {
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame()],
      selectedFrameIndex: 2
    });
    story.selectNextFrame();
    expect(story.getSelectedFrame()).toEqual(story.frames[0]);
  });

  it('should select previous frame', function () {
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame()],
      selectedFrameIndex: 2
    });
    story.selectPreviousFrame();
    expect(story.getSelectedFrame()).toEqual(story.frames[1]);
  });

  it('should wrap around when selecting previous frame', function () {
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame()]
    });
    story.selectPreviousFrame();
    expect(story.getSelectedFrame()).toEqual(story.frames[2]);
  });

  it('should add new frame', function () {
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame()],
      selectedFrameIndex: 1
    });
    story.addNewFrame();
    expect(story.frames.length).toEqual(4);
    expect(story.selectedFrameIndex).toEqual(2);
  });

  it('should delete selected frame', function () {
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame(), new Frame()],
      selectedFrameIndex: 2
    });
    story.deleteSelectedFrame();
    expect(story.frames.length).toEqual(3);
    expect(story.selectedFrameIndex).toEqual(1);
  });

  it('should delete the only frame by replacing it', function () {
    let story = new Story({
      frames: [new Frame()]
    });
    let deletedFrame = story.frames[0];
    story.deleteSelectedFrame();
    expect(story.frames[0]).not.toEqual(deletedFrame);
  });

  it('should move selected frame', function () {
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame(), new Frame(), new Frame()],
      selectedFrameIndex: 2
    });
    let oldIndex = 1;
    let newIndex = 3;
    let oldFrames = story.frames.slice(0);
    story.moveFrame(oldIndex, newIndex);
    expect(story.frames[0]).toEqual(oldFrames[0]);
    expect(story.frames[1]).toEqual(oldFrames[2]);
    expect(story.frames[2]).toEqual(oldFrames[3]);
    expect(story.frames[3]).toEqual(oldFrames[1]);
    expect(story.frames[4]).toEqual(oldFrames[4]);
  });

  it('should get frames per second', function () {
    let story = new Story({
      frames: [new Frame()],
      frameDuration: 125
    });
    expect(story.getFramesPerSecond()).toEqual(8);
  });

  it('should set frames per second', function () {
    let story = new Story({
      frames: [new Frame()]
    });
    story.setFramesPerSecond(8);
    expect(story.frameDuration).toEqual(125);
  });

  it('should play', function () {
    let frameDuration = 125;
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame()],
      frameDuration
    });
    vi.useFakeTimers();
    let callback = vi.fn();
    story.play(callback);
    vi.advanceTimersByTime(frameDuration);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(story.selectedFrameIndex).toEqual(1);
    vi.advanceTimersByTime(frameDuration);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(story.selectedFrameIndex).toEqual(2);
    vi.useRealTimers();
  });

  it('should wrap around when playing', function () {
    let frameDuration = 125;
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame()],
      frameDuration
    });
    vi.useFakeTimers();
    let callback = vi.fn();
    story.play(callback);
    expect(story.playing).toEqual(true);
    vi.advanceTimersByTime(frameDuration);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(story.selectedFrameIndex).toEqual(1);
    vi.advanceTimersByTime(frameDuration);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(story.selectedFrameIndex).toEqual(2);
    vi.advanceTimersByTime(frameDuration);
    expect(callback).toHaveBeenCalledTimes(3);
    expect(story.selectedFrameIndex).toEqual(0);
    vi.useRealTimers();
  });

  it('should play without a user callback', function () {
    let frameDuration = 125;
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame()],
      frameDuration
    });
    vi.useFakeTimers();
    story.play();
    expect(story.playing).toEqual(true);
    vi.advanceTimersByTime(frameDuration);
    expect(story.selectedFrameIndex).toEqual(1);
    vi.useRealTimers();
  });

  it('should pause', function () {
    let frameDuration = 125;
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame()],
      frameDuration
    });
    vi.useFakeTimers();
    let callback = vi.fn();
    story.play(callback);
    vi.advanceTimersByTime(frameDuration);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(story.selectedFrameIndex).toEqual(1);
    vi.advanceTimersByTime(frameDuration);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(story.selectedFrameIndex).toEqual(2);
    story.pause();
    expect(story.playing).toEqual(false);
    vi.advanceTimersByTime(frameDuration);
    expect(callback).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it('should undo', function () {
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame()],
      selectedFrameIndex: 1
    });
    story.frames[1].undo = vi.fn();
    story.undo();
    expect(story.frames[1].undo).toHaveBeenCalledOnce();
  });

  it('should redo', function () {
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame()],
      selectedFrameIndex: 1
    });
    story.frames[1].redo = vi.fn();
    story.redo();
    expect(story.frames[1].redo).toHaveBeenCalledOnce();
  });

  it('should export JSON', function () {
    let json = new Story().toJSON();
    expect(json).toHaveProperty('frames');
    expect(json).toHaveProperty('selectedFrameIndex');
    expect(json).toHaveProperty('frameDuration');
    expect(json).toHaveProperty('numPreviousFramesToShow');
    expect(json).toHaveProperty('frameStyles');
    expect(json).toHaveProperty('exportedGifSize');
  });

  it('should save', function () {
    let createdDate = Date.now();
    let story = new Story({
      metadata: {
        name: 'Foo',
        createdDate
      }
    });
    let key = `flipbook-story-${createdDate}`;
    localStorage.removeItem(key);
    story.save();
    expect(localStorage.getItem(key)).toEqual(JSON.stringify(story));
  });

});
