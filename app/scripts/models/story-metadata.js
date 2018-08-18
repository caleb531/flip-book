class StoryMetadata {

  constructor({name = 'My First Story', createdDate = Date.now()} = {}) {
    this.createdDate = createdDate;
    this.name = name;
  }

  toJSON() {
    return {
      name: this.name,
      createdDate: this.createdDate
    };
  }

}

export default StoryMetadata;
