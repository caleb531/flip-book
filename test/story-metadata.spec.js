import StoryMetadata from '../scripts/models/story-metadata.js';

describe('story metadata model', async () => {

  it('should initialize with default arguments', async () => {
    let storyMetadata = new StoryMetadata();
    expect(storyMetadata).toHaveProperty('name', 'My First Story');
    expect(storyMetadata).toHaveProperty('createdDate');
  });

  it('should initialize with supplied arguments', async () => {
    let storyMetadata = new StoryMetadata();
    expect(storyMetadata).toHaveProperty('name', 'My First Story');
    expect(storyMetadata).toHaveProperty('createdDate');
  });

  it('should export JSON', async () => {
    let json = new StoryMetadata().toJSON();
    expect(json).toHaveProperty('name');
    expect(json).toHaveProperty('createdDate');
  });

});
