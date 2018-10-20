import Story from '../app/scripts/models/story.js';
import Frame from '../app/scripts/models/frame.js';

describe('story model', function () {

  it('should initialize with default arguments', function () {
    let story = new Story();
    expect(story.frames).to.have.lengthOf(1);
    expect(story).to.have.property('selectedFrameIndex', 0);
    expect(story).to.have.property('frameDuration', 100);
    expect(story).to.have.property('previousFramesToShow', 1);
    expect(story.metadata).to.have.property('name', 'My First Story');
    expect(story).to.have.property('playing', false);
    expect(story).to.have.property('exportedGifSize', 1080);
    expect(story.frameStyles).to.have.property('strokeStyle', '#000');
    expect(story.frameStyles).to.have.property('lineWidth', 12);
  });

  it('should initialize with supplied arguments', function () {
    let createdDate = Date.now();
    let story = new Story({
      frames: [{}, {}],
      selectedFrameIndex: 1,
      frameDuration: 125,
      previousFramesToShow: 2,
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
    expect(story.frames).to.have.lengthOf(2);
    expect(story.frames[0]).to.be.instanceOf(Frame);
    expect(story).to.have.property('selectedFrameIndex', 1);
    expect(story).to.have.property('frameDuration', 125);
    expect(story).to.have.property('previousFramesToShow', 2);
    expect(story.metadata).to.have.property('name', 'My Test Story');
    expect(story.metadata).to.have.property('createdDate', createdDate);
    expect(story).to.have.property('playing', false);
    expect(story).to.have.property('exportedGifSize', 720);
    expect(story.frameStyles).to.have.property('strokeStyle', '#6c3');
    expect(story.frameStyles).to.have.property('lineWidth', 8);
  });

  it('should honor showPreviousFrame when false', function () {
    let story = new Story({showPreviousFrame: false});
    expect(story).to.have.property('previousFramesToShow', 0);
  });

  it('should honor showPreviousFrame when true', function () {
    let story = new Story({showPreviousFrame: true});
    expect(story).to.have.property('previousFramesToShow', 1);
  });

  it('should select frame', function () {
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame()]
    });
    expect(story.selectedFrameIndex).to.equal(0);
    story.selectFrame(2);
    expect(story.selectedFrameIndex).to.equal(2);
    story.selectFrame(1);
    expect(story.selectedFrameIndex).to.equal(1);
  });

  it('should get selected frame', function () {
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame()],
      selectedFrameIndex: 1
    });
    expect(story.getSelectedFrame()).to.equal(story.frames[1]);
  });

  it('should get previous frame', function () {
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame()],
      selectedFrameIndex: 1
    });
    expect(story.getPreviousFrame()).to.equal(story.frames[0]);
  });

  it('should not wrap around to get previous frame', function () {
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame()]
    });
    expect(story.getPreviousFrame()).to.equal(null);
  });

  it('should select next frame', function () {
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame()]
    });
    story.selectNextFrame();
    expect(story.getSelectedFrame()).to.equal(story.frames[1]);
  });

  it('should wrap around when selecting next frame', function () {
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame()],
      selectedFrameIndex: 2
    });
    story.selectNextFrame();
    expect(story.getSelectedFrame()).to.equal(story.frames[0]);
  });

  it('should select previous frame', function () {
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame()],
      selectedFrameIndex: 2
    });
    story.selectPreviousFrame();
    expect(story.getSelectedFrame()).to.equal(story.frames[1]);
  });

  it('should wrap around when selecting previous frame', function () {
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame()]
    });
    story.selectPreviousFrame();
    expect(story.getSelectedFrame()).to.equal(story.frames[2]);
  });

  it('should add new frame', function () {
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame()],
      selectedFrameIndex: 1
    });
    story.addNewFrame();
    expect(story.frames.length).to.equal(4);
    expect(story.selectedFrameIndex).to.equal(2);
  });

  it('should delete selected frame', function () {
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame(), new Frame()],
      selectedFrameIndex: 2
    });
    story.deleteSelectedFrame();
    expect(story.frames.length).to.equal(3);
    expect(story.selectedFrameIndex).to.equal(1);
  });

  it('should delete the only frame by replacing it', function () {
    let story = new Story({
      frames: [new Frame()]
    });
    let deletedFrame = story.frames[0];
    story.deleteSelectedFrame();
    expect(story.frames[0]).not.to.equal(deletedFrame);
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
    expect(story.frames[0]).to.equal(oldFrames[0]);
    expect(story.frames[1]).to.equal(oldFrames[2]);
    expect(story.frames[2]).to.equal(oldFrames[3]);
    expect(story.frames[3]).to.equal(oldFrames[1]);
    expect(story.frames[4]).to.equal(oldFrames[4]);
  });

  it('should get frames per second', function () {
    let story = new Story({
      frames: [new Frame()],
      frameDuration: 125
    });
    expect(story.getFramesPerSecond()).to.equal(8);
  });

  it('should set frames per second', function () {
    let story = new Story({
      frames: [new Frame()]
    });
    story.setFramesPerSecond(8);
    expect(story.frameDuration).to.equal(125);
  });

  it('should play', function () {
    let frameDuration = 125;
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame()],
      frameDuration
    });
    let clock = sinon.useFakeTimers();
    let callback = sinon.spy();
    story.play(callback);
    clock.tick(frameDuration);
    expect(callback).to.have.callCount(1);
    expect(story.selectedFrameIndex).to.equal(1);
    clock.tick(frameDuration);
    expect(callback).to.have.callCount(2);
    expect(story.selectedFrameIndex).to.equal(2);
    clock.restore();
  });

  it('should wrap around when playing', function () {
    let frameDuration = 125;
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame()],
      frameDuration
    });
    let clock = sinon.useFakeTimers();
    let callback = sinon.spy();
    story.play(callback);
    expect(story.playing).to.equal(true);
    clock.tick(frameDuration);
    expect(callback).to.have.callCount(1);
    expect(story.selectedFrameIndex).to.equal(1);
    clock.tick(frameDuration);
    expect(callback).to.have.callCount(2);
    expect(story.selectedFrameIndex).to.equal(2);
    clock.tick(frameDuration);
    expect(callback).to.have.callCount(3);
    expect(story.selectedFrameIndex).to.equal(0);
    clock.restore();
  });

  it('should play without a user callback', function () {
    let frameDuration = 125;
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame()],
      frameDuration
    });
    let clock = sinon.useFakeTimers();
    story.play();
    expect(story.playing).to.equal(true);
    clock.tick(frameDuration);
    expect(story.selectedFrameIndex).to.equal(1);
    clock.restore();
  });

  it('should pause', function () {
    let frameDuration = 125;
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame()],
      frameDuration
    });
    let clock = sinon.useFakeTimers();
    let callback = sinon.spy();
    story.play(callback);
    clock.tick(frameDuration);
    expect(callback).to.have.callCount(1);
    expect(story.selectedFrameIndex).to.equal(1);
    clock.tick(frameDuration);
    expect(callback).to.have.callCount(2);
    expect(story.selectedFrameIndex).to.equal(2);
    story.pause();
    expect(story.playing).to.equal(false);
    clock.tick(frameDuration);
    expect(callback).to.have.callCount(2);
    clock.restore();
  });

  it('should undo', function () {
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame()],
      selectedFrameIndex: 1
    });
    story.frames[1].undo = sinon.spy();
    story.undo();
    expect(story.frames[1].undo).to.have.been.calledOnce;
  });

  it('should redo', function () {
    let story = new Story({
      frames: [new Frame(), new Frame(), new Frame()],
      selectedFrameIndex: 1
    });
    story.frames[1].redo = sinon.spy();
    story.redo();
    expect(story.frames[1].redo).to.have.been.calledOnce;
  });

  it('should export JSON', function () {
    let json = new Story().toJSON();
    expect(json).to.have.property('frames');
    expect(json).to.have.property('selectedFrameIndex');
    expect(json).to.have.property('frameDuration');
    expect(json).to.have.property('previousFramesToShow');
    expect(json).to.have.property('frameStyles');
    expect(json).to.have.property('exportedGifSize');
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
    expect(localStorage.getItem(key)).to.equal(JSON.stringify(story));
  });

});
