import Story from './story.js';

class App {

  constructor({stories, selectedStoryIndex}) {
    this.stories = stories;
    this.selectedStoryIndex = selectedStoryIndex;
    this.upgradeToMultiStoryFormat();
  }

  save() {
    localStorage.setItem(`flipbook-app`, JSON.stringify(this));
  }

  upgradeToMultiStoryFormat() {
    if (localStorage.getItem('flipbook-storage-version') !== '2') {
      let oldStoryData = JSON.parse(localStorage.getItem('flipbook-story'));
      if (oldStoryData) {
        this.saveStory(this.getStoryId(0), oldStoryData);
        localStorage.removeItem('flipbook-story');
        localStorage.setItem('flipbook-storage-version', '2');
      }
    }
  }

  setSelectedStory(storyIndex) {
    this.selectedStoryIndex = storyIndex || 0;
    let selectedStoryId = this.getStoryId(storyIndex);
    this.selectedStoryData = this.loadStory(selectedStoryId);
    this.storyEditor.setStory(this.selectedStoryData);
    this.selectedStoryNameElement.innerText = this.getSelectedStory().name;
    this.save();
  }

  getSelectedStory() {
    return this.stories[this.selectedStoryIndex];
  }
  getStoryId(storyIndex) {
    return this.stories[storyIndex].createdDate;
  }

  loadStory(storyId) {
    let storyData = JSON.parse(localStorage.getItem(`flipbook-story-${storyId}`));
    if (!storyData) {
      storyData = new Story();
    }
    return storyData;
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
