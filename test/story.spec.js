import Story from '../app/scripts/models/story.js';
import Frame from '../app/scripts/models/frame.js';

describe('story model', function () {

  it('should initialize with default arguments', function () {
    let story = new Story();
    expect(story.frames).to.have.lengthOf(1);
    expect(story).to.have.property('selectedFrameIndex', 0);
    expect(story).to.have.property('frameDuration', 100);
    expect(story).to.have.property('showPreviousFrame', true);
    expect(story.metadata).to.have.property('name', 'My First Story');
    expect(story).to.have.property('playing', false);
    expect(story).to.have.property('exportedGifSize', 1080);
    expect(story.frameStyles).to.have.property('strokeStyle', '#000');
    expect(story.frameStyles).to.have.property('lineWidth', 12);
  });

  it('should initialize with supplied arguments', function () {
    let createdDate = Date.now();
    let story = new Story({
      frames: [new Frame(), new Frame()],
      selectedFrameIndex: 1,
      frameDuration: 125,
      showPreviousFrame: false,
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
    expect(story).to.have.property('selectedFrameIndex', 1);
    expect(story).to.have.property('frameDuration', 125);
    expect(story).to.have.property('showPreviousFrame', false);
    expect(story.metadata).to.have.property('name', 'My Test Story');
    expect(story.metadata).to.have.property('createdDate', createdDate);
    expect(story).to.have.property('playing', false);
    expect(story).to.have.property('exportedGifSize', 720);
    expect(story.frameStyles).to.have.property('strokeStyle', '#6c3');
    expect(story.frameStyles).to.have.property('lineWidth', 8);
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

});
