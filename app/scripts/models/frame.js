class Frame {

  // Default arguments get evaluated at call time (unlike Python); see:
  // <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters#Evaluated_at_call_time>
  constructor({styles = {}, groups = [], undoHistory = []} = {}) {
    this.temporaryId = Frame.nextAutoIncrementedId;
    Frame.nextAutoIncrementedId += 1;
    this.styles = Object.assign({}, Frame.defaultStyles, _.pick(styles, [
      'strokeStyle',
      'lineWidth'
      // lineCap and lineJoin will be the same for every frame, so we don't need
      // to add extra bloat by exporting them onto each frame
    ]));
    this.groups = groups;
    this.undoHistory = undoHistory;
  }

  startNewGroup({styles}) {
    this.groups.push({
      points: [],
      styles
    });
  }

  addPoint(x, y) {
    this.groups[this.groups.length - 1].points.push([x, y]);
  }

  countPointsInLastGroup() {
    if (this.groups.length > 0) {
      return this.groups[this.groups.length - 1].points.length;
    } else {
      return 0;
    }
  }

  reset() {
    this.groups.length = 0;
    this.undoHistory.length = 0;
  }

  undo() {
    if (this.groups.length > 0) {
      this.undoHistory.push(this.groups.pop());
    }
  }

  redo() {
    if (this.undoHistory.length > 0) {
      this.groups.push(this.undoHistory.pop());
    }
  }

  toJSON() {
    return _.pick(this, ['styles', 'groups', 'undoHistory']);
  }

}
Frame.nextAutoIncrementedId = 0;
Frame.defaultStyles = {
  strokeStyle: '#000',
  lineWidth: 12,
  lineCap: 'round',
  lineJoin: 'round'
};

export default Frame;
