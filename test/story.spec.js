import Story from '../app/scripts/models/story.js';

describe('story model', function () {

  it('should initialize', function () {
    let story = new Story();
    chai.expect(story).to.have.property('playing', false);
  });

});
