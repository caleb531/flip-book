import Frame from '../scripts/models/frame.js';

describe('frame model', async () => {

  it('should initialize with default arguments', async () => {
    let frame = new Frame();
    expect(frame.styles).toHaveProperty('strokeStyle', '#000');
    expect(frame.styles).toHaveProperty('lineWidth', 12);
    expect(frame.strokeGroups).toHaveLength(0);
    expect(frame.undoHistory).toHaveLength(0);
  });

  it('should initialize with default arguments', async () => {
    let frame = new Frame({
      styles: {
        strokeStyle: '#6c3',
        lineWidth: 8
      },
      strokeGroups: [{
        points: [[300, 150]],
        styles: {strokeStyle: '#c33', lineWidth: 16}
      }]
    });
    expect(frame.styles).toHaveProperty('strokeStyle', '#6c3');
    expect(frame.styles).toHaveProperty('lineWidth', 8);
    expect(frame.strokeGroups).toHaveLength(1);
    expect(frame.strokeGroups[0].points).toHaveLength(1);
    expect(frame.strokeGroups[0].points[0][0]).toEqual(300);
    expect(frame.strokeGroups[0].points[0][1]).toEqual(150);
    expect(frame.strokeGroups[0].styles).toHaveProperty('strokeStyle', '#c33');
    expect(frame.strokeGroups[0].styles).toHaveProperty('lineWidth', 16);
  });

  it('should read groups argument into strokeGroups', async () => {
    let frame = new Frame({
      groups: [{
        points: [[300, 150]],
        styles: {strokeStyle: '#c33', lineWidth: 16}
      }]
    });
    expect(frame).not.toHaveProperty('groups');
    expect(frame).toHaveProperty('strokeGroups');
    expect(frame.strokeGroups).toHaveLength(1);
    expect(frame.strokeGroups[0].points).toHaveLength(1);
    expect(frame.strokeGroups[0].points[0][0]).toEqual(300);
    expect(frame.strokeGroups[0].points[0][1]).toEqual(150);
    expect(frame.strokeGroups[0].styles).toHaveProperty('strokeStyle', '#c33');
    expect(frame.strokeGroups[0].styles).toHaveProperty('lineWidth', 16);
  });

  it('should add new group', async () => {
    let frame = new Frame();
    frame.startNewGroup({
      styles: {
        strokeStyle: '#6c3',
        lineWidth: 20
      }
    });
    expect(frame.strokeGroups).toHaveLength(1);
    expect(frame.strokeGroups[0].points).toHaveLength(0);
    expect(frame.strokeGroups[0].styles).toHaveProperty('strokeStyle', '#6c3');
    expect(frame.strokeGroups[0].styles).toHaveProperty('lineWidth', 20);
  });

  it('should add new point', async () => {
    let frame = new Frame();
    frame.startNewGroup({
      styles: {
        strokeStyle: '#6c3',
        lineWidth: 20
      }
    });
    frame.addPoint(300, 150);
    expect(frame.strokeGroups).toHaveLength(1);
    expect(frame.strokeGroups[0].points).toHaveLength(1);
    expect(frame.strokeGroups[0].points[0][0]).toEqual(300);
    expect(frame.strokeGroups[0].points[0][1]).toEqual(150);
    expect(frame.strokeGroups[0].styles).toHaveProperty('strokeStyle', '#6c3');
    expect(frame.strokeGroups[0].styles).toHaveProperty('lineWidth', 20);
  });

  it('should combine points with same slope', async () => {
    let frame = new Frame();
    frame.startNewGroup({
      styles: {
        strokeStyle: '#6c3',
        lineWidth: 20
      }
    });
    frame.addPoint(300, 150);
    frame.addPoint(2, 0);
    frame.addPoint(3, 0);
    expect(frame.strokeGroups).toHaveLength(1);
    expect(frame.strokeGroups[0].points).toHaveLength(2);
    expect(frame.strokeGroups[0].points[1][0]).toEqual(5);
    expect(frame.strokeGroups[0].points[1][1]).toEqual(0);
  });

  it('should count points in last group', async () => {
    let frame = new Frame();
    frame.startNewGroup();
    expect(frame.countPointsInLastStrokeGroup()).toEqual(0);
    frame.startNewGroup();
    frame.addPoint(300, 150);
    frame.addPoint(1, 3);
    frame.addPoint(2, 1);
    expect(frame.countPointsInLastStrokeGroup()).toEqual(3);
  });

  it('should count zero points if there are no groups', async () => {
    let frame = new Frame();
    expect(frame.countPointsInLastStrokeGroup()).toEqual(0);
  });

  it('should undo stroke', async () => {
    let frame = new Frame();
    frame.startNewGroup();
    frame.addPoint(300, 150);
    frame.startNewGroup();
    frame.addPoint(200, 120);
    expect(frame.undoHistory).toHaveLength(0);
    let lastGroup = frame.strokeGroups[1];
    frame.undo();
    expect(frame.undoHistory).toHaveLength(1);
    expect(frame.undoHistory[0]).toEqual(lastGroup);
  });

  it('should do nothing if there is nothing to undo', async () => {
    let frame = new Frame();
    frame.undo();
    expect(frame.undoHistory).toHaveLength(0);
  });

  it('should redo stroke', async () => {
    let frame = new Frame();
    frame.startNewGroup();
    frame.addPoint(300, 150);
    frame.startNewGroup();
    frame.addPoint(200, 120);
    expect(frame.undoHistory).toHaveLength(0);
    let lastGroup = frame.strokeGroups[1];
    frame.undo();
    frame.redo();
    expect(frame.undoHistory).toHaveLength(0);
    expect(frame.strokeGroups[1]).toEqual(lastGroup);
  });

  it('should do nothing if there is nothing to redo', async () => {
    let frame = new Frame();
    frame.redo();
    expect(frame.undoHistory).toHaveLength(0);
  });

  it('should reset undo history', async () => {
    let frame = new Frame();
    frame.startNewGroup();
    frame.addPoint(300, 150);
    frame.undo();
    expect(frame.undoHistory).toHaveLength(1);
    frame.resetUndoHistory();
    expect(frame.undoHistory).toHaveLength(0);
  });

  it('should export JSON', async () => {
    let json = new Frame().toJSON();
    expect(json).toHaveProperty('styles');
    expect(json.styles).toHaveProperty('strokeStyle');
    expect(json.styles).toHaveProperty('lineWidth');
    expect(json).toHaveProperty('strokeGroups');
  });

});
