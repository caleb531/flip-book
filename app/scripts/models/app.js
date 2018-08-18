import Story from './story.js';

class App {

  constructor({stories, selectedStoryIndex}) {
    this.stories = stories;
    this.setSelectedStory(selectedStoryIndex);
    this.upgradeToMultiStoryFormat();
  }

  save() {
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

  setSelectedStory(storyIndex) {
    this.selectedStoryIndex = storyIndex || 0;
    this.selectedStory = this.loadStory(this.getStoryId(storyIndex));
    this.save();
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
    return {
      stories: this.stories,
      selectedStoryIndex: this.selectedStoryIndex
    };
  }

}

App.saveDelay = 250;

App.restore = function () {
  let app = JSON.parse(localStorage.getItem('flipbook-app'));
  if (!app) {
    // The default app for brand new sessions
    return new App({
      stories: [{
        createdDate: Date.now(),
        name: 'My First Story',
        lastUpdatedDate: Date.now()
      }],
      selectedStoryIndex: 0
    });
  } else {
    // The order of the array elements is the reverse of the display order
    app.stories = _.orderBy(app.stories, (story) => story.createdDate, 'desc');
    return new App(app);
  }
};

export default App;
