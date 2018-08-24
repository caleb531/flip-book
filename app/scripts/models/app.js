import Story from './story.js';
import StoryMetadata from './story-metadata.js';

class App {

  constructor({stories = [new StoryMetadata()], selectedStoryIndex = 0} = {}) {
    this.stories = stories;
    this.selectStory(selectedStoryIndex);
    this.upgradeToMultiStoryFormat();
  }

  save() {
    localStorage.setItem(`flipbook-app`, JSON.stringify(this));
  }

  upgradeToMultiStoryFormat() {
    if (localStorage.getItem('flipbook-storage-version') !== '2') {
      let oldStory = JSON.parse(localStorage.getItem('flipbook-story'));
      if (oldStory) {
        // Replace the contents of the default v2 story with the contents of the
        // old (v1) story
        oldStory.metadata = this.selectedStory.metadata;
        oldStory.save();
        localStorage.removeItem('flipbook-story');
        this.selectStory(0);
      }
      localStorage.setItem('flipbook-storage-version', '2');
    }
  }

  selectStory(storyIndex) {
    this.selectedStoryIndex = storyIndex || 0;
    this.selectedStory = this.loadStory(this.stories[storyIndex].createdDate);
    this.selectedStory.metadata = this.getSelectedStoryMetadata();
    this.save();
  }

  getSelectedStoryMetadata() {
    return this.stories[this.selectedStoryIndex];
  }

  loadStory(storyId) {
    let story = JSON.parse(localStorage.getItem(`flipbook-story-${storyId}`));
    if (!story) {
      return new Story();
    } else {
      return new Story(story);
    }
  }

  toJSON() {
    return _.pick(this, ['stories', 'selectedStoryIndex']);
  }

}

App.saveDelay = 250;

App.restore = function () {
  let app = JSON.parse(localStorage.getItem('flipbook-app'));
  if (!app) {
    // The default app for brand new sessions
    return new App();
  } else {
    app.stories = app.stories.map((storyMetadata) => new StoryMetadata(storyMetadata));
    app.stories = _.orderBy(app.stories, (story) => story.createdDate, 'desc');
    return new App(app);
  }
};

export default App;
