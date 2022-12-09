import _ from 'underscore';

class StoryMetadata {

  constructor({name = 'My First Story', createdDate = Date.now()} = {}) {
    this.name = name;
    this.createdDate = createdDate;
  }

  toJSON() {
    return _.pick(this, ['name', 'createdDate']);
  }

}

export default StoryMetadata;
