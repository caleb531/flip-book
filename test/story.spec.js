import Story from '../app/scripts/models/story.js';

describe('story model', function () {

  it('should initialize', function () {
    let story = new Story();
    expect(story).to.have.property('playing', false);
  });

});
