class Frame {

  // Default arguments get evaluated at call time (unlike Python); see:
  // <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters#Evaluated_at_call_time>
  constructor({styles = {}, strokeGroups = [], groups = []} = {}) {
    this.temporaryId = Frame.nextAutoIncrementedId;
    Frame.nextAutoIncrementedId += 1;
    this.styles = Object.assign({}, Frame.defaultStyles, _.pick(styles, [
      'strokeStyle',
      'lineWidth'
      // lineCap and lineJoin will be the same for every frame, so we don't need
      // to add extra bloat by exporting them onto each frame
    ]));
    // The 'groups' property has been deprecated in favor of 'strokeGroups', but
    // for backwards compatibility, the former is still recognized if present
    if (groups.length > 0) {
      this.strokeGroups = groups;
    } else {
      this.strokeGroups = strokeGroups;
    }
    this.undoHistory = [];
  }

  startNewGroup({styles = {}} = {}) {
    this.strokeGroups.push({
      points: [],
      styles
    });
  }

  addPoint(x, y) {
    this.getLastStrokeGroup().points.push([x, y]);
  }

  getLastStrokeGroup() {
    return this.strokeGroups[this.strokeGroups.length - 1];
  }

  countPointsInLastGroup() {
    if (this.strokeGroups.length > 0) {
      return this.getLastStrokeGroup().points.length;
    } else {
      return 0;
    }
  }

  undo() {
    if (this.strokeGroups.length > 0) {
      this.undoHistory.push(this.strokeGroups.pop());
    }
  }

  redo() {
    if (this.undoHistory.length > 0) {
      this.strokeGroups.push(this.undoHistory.pop());
    }
  }

  resetUndoHistory() {
    this.undoHistory.length = 0;
  }

  toJSON() {
    return _.pick(this, ['styles', 'strokeGroups']);
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
