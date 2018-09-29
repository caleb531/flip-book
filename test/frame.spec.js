import Frame from '../app/scripts/models/frame.js';

describe('frame model', function () {

  it('should initialize with default arguments', function () {
    let frame = new Frame();
    expect(frame.styles).to.have.property('strokeStyle', '#000');
    expect(frame.styles).to.have.property('lineWidth', 12);
    expect(frame.groups).to.have.lengthOf(0);
    expect(frame.undoHistory).to.have.lengthOf(0);
  });

  it('should initialize with default arguments', function () {
    let frame = new Frame({
      styles: {
        strokeStyle: '#6c3',
        lineWidth: 8
      },
      groups: [{
        points: [[300, 150]],
        styles: {strokeStyle: '#c33', lineWidth: 16}
      }]
    });
    expect(frame.styles).to.have.property('strokeStyle', '#6c3');
    expect(frame.styles).to.have.property('lineWidth', 8);
    expect(frame.groups).to.have.lengthOf(1);
    expect(frame.groups[0].points).to.have.lengthOf(1);
    expect(frame.groups[0].points[0][0]).to.equal(300);
    expect(frame.groups[0].points[0][1]).to.equal(150);
    expect(frame.groups[0].styles).to.have.property('strokeStyle', '#c33');
    expect(frame.groups[0].styles).to.have.property('lineWidth', 16);
  });

  it('should add new group', function () {
    let frame = new Frame();
    frame.startNewGroup({
      styles: {
        strokeStyle: '#6c3',
        lineWidth: 20
      }
    });
    expect(frame.groups).to.have.lengthOf(1);
    expect(frame.groups[0].points).to.have.lengthOf(0);
    expect(frame.groups[0].styles).to.have.property('strokeStyle', '#6c3');
    expect(frame.groups[0].styles).to.have.property('lineWidth', 20);
  });

  it('should add new group', function () {
    let frame = new Frame();
    frame.startNewGroup({
      styles: {
        strokeStyle: '#6c3',
        lineWidth: 20
      }
    });
    frame.addPoint(300, 150);
    expect(frame.groups).to.have.lengthOf(1);
    expect(frame.groups[0].points).to.have.lengthOf(1);
    expect(frame.groups[0].points[0][0]).to.equal(300);
    expect(frame.groups[0].points[0][1]).to.equal(150);
    expect(frame.groups[0].styles).to.have.property('strokeStyle', '#6c3');
    expect(frame.groups[0].styles).to.have.property('lineWidth', 20);
  });

  it('should count points in last group', function () {
    let frame = new Frame();
    frame.startNewGroup();
    expect(frame.countPointsInLastGroup()).to.equal(0);
    frame.startNewGroup();
    frame.addPoint(300, 150);
    frame.addPoint(1, 3);
    frame.addPoint(2, 1);
    expect(frame.countPointsInLastGroup()).to.equal(3);
  });

  it('should count zero points if there are no groups', function () {
    let frame = new Frame();
    expect(frame.countPointsInLastGroup()).to.equal(0);
  });

  it('should undo stroke', function () {
    let frame = new Frame();
    frame.startNewGroup();
    frame.addPoint(300, 150);
    frame.startNewGroup();
    frame.addPoint(200, 120);
    expect(frame.undoHistory).to.have.lengthOf(0);
    let lastGroup = frame.groups[1];
    frame.undo();
    expect(frame.undoHistory).to.have.lengthOf(1);
    expect(frame.undoHistory[0]).to.equal(lastGroup);
  });

  it('should do nothing if there is nothing to undo', function () {
    let frame = new Frame();
    frame.undo();
    expect(frame.undoHistory).to.have.lengthOf(0);
  });

  it('should redo stroke', function () {
    let frame = new Frame();
    frame.startNewGroup();
    frame.addPoint(300, 150);
    frame.startNewGroup();
    frame.addPoint(200, 120);
    expect(frame.undoHistory).to.have.lengthOf(0);
    let lastGroup = frame.groups[1];
    frame.undo();
    frame.redo();
    expect(frame.undoHistory).to.have.lengthOf(0);
    expect(frame.groups[1]).to.equal(lastGroup);
  });

  it('should do nothing if there is nothing to redo', function () {
    let frame = new Frame();
    frame.redo();
    expect(frame.undoHistory).to.have.lengthOf(0);
  });

  it('should export JSON', function () {
    let json = new Frame().toJSON();
    expect(json).to.have.property('styles');
    expect(json.styles).to.have.property('strokeStyle');
    expect(json.styles).to.have.property('lineWidth');
    expect(json).to.have.property('groups');
  });

});
