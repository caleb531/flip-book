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
    this.lastAbsX = 0;
    this.lastAbsY = 0;
    this.lastSlope = 0;
  }

  addPoint(absX, absY) {
    let group = this.getLastStrokeGroup();
    let newSlope = Math.atan2(absY - this.lastAbsY, absX - this.lastAbsX);
    if (group.points.length >= 2 && newSlope === this.lastSlope) {
      group.points[group.points.length - 1][0] += absX - this.lastAbsX;
      group.points[group.points.length - 1][1] += absY - this.lastAbsY;
    } else {
      group.points.push([
        absX - this.lastAbsX,
        absY - this.lastAbsY
      ]);
    }
    this.lastAbsX = absX;
    this.lastAbsY = absY;
    this.lastSlope = newSlope;
  }

  getLastStrokeGroup() {
    return this.strokeGroups[this.strokeGroups.length - 1];
  }

  countPointsInLastStrokeGroup() {
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
