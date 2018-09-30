import App from '../app/scripts/models/app.js';
import StoryMetadata from '../app/scripts/models/story-metadata.js';

describe('app model', function () {

  it('should initialize with default arguments', function () {
    let app = new App();
    expect(app).to.have.property('stories');
    expect(app.stories).to.have.lengthOf(1);
    expect(app).to.have.property('selectedStoryIndex', 0);
  });

  it('should initialize with supplied arguments', function () {
    let app = new App({
      stories: [{}]
    });
    expect(app).to.have.property('stories');
    expect(app.stories).to.have.lengthOf(1);
    expect(app.stories[0]).to.be.instanceOf(StoryMetadata);
    expect(app.stories[0]).to.have.property('name');
    expect(app.stories[0]).to.have.property('createdDate');
    expect(app).to.have.property('selectedStoryIndex', 0);
  });

});
