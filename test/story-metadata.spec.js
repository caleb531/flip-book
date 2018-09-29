import StoryMetadata from '../app/scripts/models/story-metadata.js';

describe('story metadata model', function () {

  it('should initialize with default arguments', function () {
    let storyMetadata = new StoryMetadata();
    expect(storyMetadata).to.have.property('name', 'My First Story');
    expect(storyMetadata).to.have.property('createdDate');
  });

  it('should initialize with supplied arguments', function () {
    let storyMetadata = new StoryMetadata();
    expect(storyMetadata).to.have.property('name', 'My First Story');
    expect(storyMetadata).to.have.property('createdDate');
  });

});
