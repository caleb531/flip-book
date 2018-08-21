import Story from './story.js';
import StoryMetadata from './story-metadata.js';

class App {

  constructor({stories = [new StoryMetadata()], selectedStoryIndex = 0} = {}) {
    this.stories = stories;
    this.selectStory(selectedStoryIndex);
    this.upgradeToMultiStoryFormat();
  }

  saveApp() {
    localStorage.setItem(`flipbook-app`, JSON.stringify(this));
  }

  upgradeToMultiStoryFormat() {
    if (localStorage.getItem('flipbook-storage-version') !== '2') {
      let oldStory = JSON.parse(localStorage.getItem('flipbook-story'));
      if (oldStory) {
        this.saveStory(this.getStoryId(0), oldStory);
        localStorage.removeItem('flipbook-story');
        localStorage.setItem('flipbook-storage-version', '2');
      }
    }
  }

  selectStory(storyIndex) {
    this.selectedStoryIndex = storyIndex || 0;
    this.selectedStory = this.loadStory(this.getStoryId(storyIndex));
    this.saveApp();
  }

  getSelectedStoryMetadata() {
    return this.stories[this.selectedStoryIndex];
  }
  getStoryId(storyIndex) {
    return this.stories[storyIndex].createdDate;
  }
  getSelectedStoryId() {
    return this.getStoryId(this.selectedStoryIndex);
  }

  loadStory(storyId) {
    let story = JSON.parse(localStorage.getItem(`flipbook-story-${storyId}`));
    if (!story) {
      return new Story();
    } else {
      return new Story(story);
    }
  }

  saveStory(storyId, storyData) {
    localStorage.setItem(`flipbook-story-${storyId}`, JSON.stringify(storyData));
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
