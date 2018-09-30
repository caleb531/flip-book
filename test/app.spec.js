import App from '../app/scripts/models/app.js';
import StoryMetadata from '../app/scripts/models/story-metadata.js';
import Story from '../app/scripts/models/story.js';

describe('app model', function () {

  it('should initialize with default arguments', function () {
    let app = new App();
    expect(app).to.have.property('stories');
    expect(app.stories).to.have.lengthOf(1);
    expect(app.stories[0]).to.be.instanceOf(StoryMetadata);
    expect(app).to.have.property('selectedStoryIndex', 0);
  });

  it('should initialize with supplied arguments', function () {
    let app = new App({
      stories: [
        {name: 'Foo Story'},
        {name: 'Bar Story'},
        {name: 'Baz Story'},
      ],
      selectedStoryIndex: 1
    });
    expect(app).to.have.property('stories');
    expect(app.stories).to.have.lengthOf(3);
    expect(app.stories[0]).to.be.instanceOf(StoryMetadata);
    expect(app.stories[0]).to.have.property('name', 'Foo Story');
    expect(app).to.have.property('selectedStoryIndex', 1);
    expect(app).to.have.property('selectedStory');
    expect(app.selectedStory).to.be.instanceOf(Story);
  });

  it('should select story', function () {
    let app = new App({
      stories: [
        {name: 'Foo Story'},
        {name: 'Bar Story'},
        {name: 'Baz Story'},
        {name: 'Last Story'}
      ]
    });
    expect(app).to.have.property('selectedStoryIndex', 0);
    app.selectStory(2);
    expect(app).to.have.property('selectedStoryIndex', 2);
  });

  it('should load story data when selecting story', function () {
    let app = new App({
      stories: [
        {name: 'Foo Story'},
        {name: 'Bar Story'},
        {name: 'Baz Story'},
        {name: 'Last Story'}
      ]
    });
    expect(app).to.have.property('selectedStoryIndex', 0);
    app.selectStory(2);
    expect(app).to.have.property('selectedStory');
    expect(app.selectedStory).to.be.instanceOf(Story);
    expect(app.selectedStory).to.have.property('metadata');
    expect(app.selectedStory.metadata).to.equal(app.stories[2]);
  });

  it('should get selected story metadata', function () {
    let app = new App({
      stories: [{}, {}, {}],
      selectedStoryIndex: 1
    });
    expect(app.getSelectedStoryMetadata()).to.equal(app.stories[1]);
  });

  it('should get selected story metadata', function () {
    let app = new App({
      stories: [
        {name: 'Foo Story'},
        {name: 'Bar Story'},
        {name: 'Baz Story'},
      ],
      selectedStoryIndex: 1
    });
    expect(app.getSelectedStoryName()).to.equal('Bar Story');
  });

  it('should rename selected story', function () {
    let app = new App({
      stories: [
        {name: 'Foo Story'},
        {name: 'Bar Story'},
        {name: 'Baz Story'},
      ],
      selectedStoryIndex: 1
    });
    app.renameSelectedStory('Story Reborn');
    expect(app.stories[1].name).to.equal('Story Reborn');
  });

  it('should delete selected story', function () {
    let app = new App({
      stories: [
        {name: 'Foo Story'},
        {name: 'Bar Story'},
        {name: 'Baz Story'},
      ],
      selectedStoryIndex: 1
    });
    app.deleteSelectedStory();
    expect(app.stories).to.have.lengthOf(2);
    expect(app.stories[0].name).to.equal('Foo Story');
    expect(app.stories[1].name).to.equal('Baz Story');
  });

  it('should export JSON', function () {
    let json = new App().toJSON();
    expect(json).to.have.property('stories');
    expect(json).to.have.property('selectedStoryIndex');
  });

  it('should save', function () {
    let app = new App({
      stories: [
        {name: 'Foo Story'},
        {name: 'Bar Story'},
        {name: 'Baz Story'},
      ],
      selectedStoryIndex: 1
    });
    let key = 'flipbook-manifest';
    localStorage.removeItem(key);
    app.save();
    expect(localStorage.getItem(key)).to.equal(JSON.stringify(app));
  });

});
