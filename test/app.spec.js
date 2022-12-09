import App from '../scripts/models/app.js';
import StoryMetadata from '../scripts/models/story-metadata.js';
import Story from '../scripts/models/story.js';

describe('app model', function () {

  beforeEach(function () {
    localStorage.setItem('flipbook-storage-version', '2');
  });

  afterEach(function () {
    localStorage.removeItem('flipbook-storage-version');
  });

  it('should initialize with default arguments', function () {
    let app = new App();
    expect(app).toHaveProperty('stories');
    expect(app.stories).toHaveLength(1);
    expect(app.stories[0]).toBeInstanceOf(StoryMetadata);
    expect(app).toHaveProperty('selectedStoryIndex', 0);
    expect(app).toHaveProperty('selectedStoryIndex', 0);
  });

  it('should initialize with supplied arguments', function () {
    let app = new App({
      stories: [
        {name: 'Foo Story'},
        {name: 'Bar Story'},
        {name: 'Baz Story'}
      ],
      selectedStoryIndex: 1
    });
    expect(app).toHaveProperty('stories');
    expect(app.stories).toHaveLength(3);
    expect(app.stories[0]).toBeInstanceOf(StoryMetadata);
    expect(app.stories[0]).toHaveProperty('name', 'Foo Story');
    expect(app).toHaveProperty('selectedStoryIndex', 1);
    expect(app).toHaveProperty('selectedStory');
    expect(app.selectedStory).toBeInstanceOf(Story);
  });

  it('should upgrade data store on initialization', function () {
    localStorage.removeItem('flipbook-storage-version');
    localStorage.setItem('flipbook-story', JSON.stringify({
      frameDuration: 125,
      numPreviousFramesToShow: 2
    }));
    let app = new App();
    let key = `flipbook-story-${app.stories[0].createdDate}`;
    let storyJson = JSON.parse(localStorage.getItem(key));
    expect(storyJson).toHaveProperty('frameDuration', 125);
    expect(storyJson).toHaveProperty('numPreviousFramesToShow', 2);
    expect(localStorage.getItem('flipbook-storage-version')).toEqual('2');
    expect(localStorage.getItem('flipbook-story')).toEqual(null);
  });

  it('should mark data store as v2 even if nothing to upgrade', function () {
    localStorage.removeItem('flipbook-storage-version');
    let app = new App();
    expect(app.stories).toHaveLength(1);
    expect(localStorage.getItem('flipbook-storage-version')).toEqual('2');
    expect(localStorage.getItem('flipbook-story')).toEqual(null);
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
    expect(app).toHaveProperty('selectedStoryIndex', 0);
    app.selectStory(2);
    expect(app).toHaveProperty('selectedStoryIndex', 2);
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
    expect(app).toHaveProperty('selectedStoryIndex', 0);
    app.selectStory(2);
    expect(app).toHaveProperty('selectedStory');
    expect(app.selectedStory).toBeInstanceOf(Story);
    expect(app.selectedStory).toHaveProperty('metadata');
    expect(app.selectedStory.metadata).toEqual(app.stories[2]);
  });

  it('should get selected story metadata', function () {
    let app = new App({
      stories: [{}, {}, {}],
      selectedStoryIndex: 1
    });
    expect(app.getSelectedStoryMetadata()).toEqual(app.stories[1]);
  });

  it('should get selected story metadata', function () {
    let app = new App({
      stories: [
        {name: 'Foo Story'},
        {name: 'Bar Story'},
        {name: 'Baz Story'}
      ],
      selectedStoryIndex: 1
    });
    expect(app.getSelectedStoryName()).toEqual('Bar Story');
  });

  it('should rename selected story', function () {
    let app = new App({
      stories: [
        {name: 'Foo Story'},
        {name: 'Bar Story'},
        {name: 'Baz Story'}
      ],
      selectedStoryIndex: 1
    });
    app.renameSelectedStory('Story Reborn');
    expect(app.stories[1].name).toEqual('Story Reborn');
  });

  it('should delete selected story', function () {
    let app = new App({
      stories: [
        {name: 'Foo Story'},
        {name: 'Bar Story'},
        {name: 'Baz Story'}
      ],
      selectedStoryIndex: 1
    });
    app.deleteSelectedStory();
    expect(app.stories).toHaveLength(2);
    expect(app.stories[0].name).toEqual('Foo Story');
    expect(app.stories[1].name).toEqual('Baz Story');
  });

  it('should delete the only story by replacing it', function () {
    let app = new App({
      stories: [{name: 'Foo Story', createdDate: Date.now()}]
    });
    app.deleteSelectedStory();
    expect(app.stories[0]).toHaveProperty('name', 'My First Story');
  });

  it('should create new story', function () {
    let app = new App();
    let defaultStory = app.stories[0];
    app.createNewStoryWithName('My New Story');
    expect(app.stories).toHaveLength(2);
    expect(app.selectedStoryIndex).toEqual(0);
    expect(app.stories[0]).not.toEqual(defaultStory);
    expect(app.stories[1]).toEqual(defaultStory);
  });

  it('should add existing story', function () {
    let app = new App();
    let story = new Story({
      frames: [{}, {}],
      selectedFrameIndex: 1,
      frameDuration: 125,
      metadata: {
        name: 'My Test Story',
        createdDate: Date.now()
      }
    });
    let defaultStory = app.stories[0];
    app.addExistingStory(story);
    expect(app.stories).toHaveLength(2);
    expect(app.selectedStoryIndex).toEqual(0);
    expect(app.selectedStory.frameDuration).toEqual(story.frameDuration);
    expect(app.stories[0]).not.toEqual(defaultStory);
    expect(app.stories[1]).toEqual(defaultStory);
  });

  it('should export JSON', function () {
    let json = new App().toJSON();
    expect(json).toHaveProperty('stories');
    expect(json).toHaveProperty('selectedStoryIndex');
  });

  it('should save', function () {
    let app = new App({
      stories: [
        {name: 'Foo Story'},
        {name: 'Bar Story'},
        {name: 'Baz Story'}
      ],
      selectedStoryIndex: 1
    });
    let key = 'flipbook-manifest';
    localStorage.removeItem(key);
    app.save();
    expect(localStorage.getItem(key)).toEqual(JSON.stringify(app));
  });

  it('should do nothing if nothing to restore', function () {
    localStorage.removeItem('flipbook-manifest');
    let app = App.restore();
    expect(app).toHaveProperty('stories');
    expect(app.stories).toHaveLength(1);
    expect(app.selectedStoryIndex).toEqual(0);
    expect(app.stories[0].name).toEqual('My First Story');
  });

  it('should restore persisted app data', function () {
    localStorage.setItem('flipbook-manifest', JSON.stringify({
      stories: [
        {name: 'Foo', createdDate: Date.now()},
        {name: 'Bar', createdDate: Date.now() + 10},
        {name: 'Baz', createdDate: Date.now() + 20}
      ],
      selectedStoryIndex: 1
    }));
    let app = App.restore();
    expect(app).toHaveProperty('stories');
    expect(app.stories).toHaveLength(3);
    expect(app.selectedStoryIndex).toEqual(1);
    expect(app.stories[0].name).toEqual('Foo');
    expect(app.stories[1].name).toEqual('Bar');
    expect(app.stories[2].name).toEqual('Baz');
  });

  it('should save immediately if app is created from scratch', function () {
    localStorage.removeItem('flipbook-manifest');
    App.restore();
    expect(localStorage.getItem('flipbook-manifest')).not.toBeNull();
  });

});
