import StoryMetadata from '../app/scripts/models/story-metadata.js';

describe('story metadata model', function () {

  it('should initialize with default arguments', function () {
    let storyMetadata = new StoryMetadata();
    expect(storyMetadata).toHaveProperty('name', 'My First Story');
    expect(storyMetadata).toHaveProperty('createdDate');
  });

  it('should initialize with supplied arguments', function () {
    let storyMetadata = new StoryMetadata();
    expect(storyMetadata).toHaveProperty('name', 'My First Story');
    expect(storyMetadata).toHaveProperty('createdDate');
  });

  it('should export JSON', function () {
    let json = new StoryMetadata().toJSON();
    expect(json).toHaveProperty('name');
    expect(json).toHaveProperty('createdDate');
  });

});
