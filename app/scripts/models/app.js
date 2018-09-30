import Story from './story.js';
import StoryMetadata from './story-metadata.js';

class App {

  constructor({stories = [new StoryMetadata()], selectedStoryIndex = 0} = {}) {
    this.stories = stories.map((storyMetadata) => new StoryMetadata(storyMetadata));
    this.selectStory(selectedStoryIndex);
    this.upgradeToMultiStoryFormat();
  }

  save() {
    localStorage.setItem('flipbook-manifest', JSON.stringify(this));
  }

  upgradeToMultiStoryFormat() {
    if (localStorage.getItem('flipbook-storage-version') !== '2') {
      let oldStoryJson = JSON.parse(localStorage.getItem('flipbook-story'));
      if (oldStoryJson) {
        let oldStory = new Story(oldStoryJson);
        // Replace the contents of the default v2 story with the contents of the
        // old (v1) story
        oldStory.metadata = this.getSelectedStoryMetadata();
        oldStory.save();
        localStorage.removeItem('flipbook-story');
        this.selectStory(0);
      }
      localStorage.setItem('flipbook-storage-version', '2');
    }
  }

  selectStory(storyIndex) {
    this.selectedStoryIndex = storyIndex || 0;
    this.selectedStory = this.loadStory(this.getSelectedStoryMetadata().createdDate);
    this.selectedStory.metadata = this.getSelectedStoryMetadata();
    this.save();
  }

  getSelectedStoryMetadata() {
    return this.stories[this.selectedStoryIndex];
  }

  getSelectedStoryName() {
    return this.selectedStory.metadata.name;
  }

  renameSelectedStory(newStoryName) {
    this.selectedStory.metadata.name = newStoryName;
    this.save();
  }

  loadStory(storyId) {
    let story = JSON.parse(localStorage.getItem(`flipbook-story-${storyId}`));
    if (!story) {
      return new Story();
    } else {
      return new Story(story);
    }
  }

  createNewStoryWithName(storyName) {
    this.stories.unshift(new StoryMetadata({
      name: storyName
    }));
    this.selectStory(0);
    this.save();
  }

  addExistingStory(story) {
    story.save();
    this.stories.unshift(story.metadata);
    this.selectStory(0);
  }

  deleteSelectedStory() {
    if (this.stories.length === 1) {
      this.stories.splice(this.selectedStoryIndex, 1, new StoryMetadata());
      this.selectStory(0);
    } else {
      this.stories.splice(this.selectedStoryIndex, 1);
      this.selectStory(Math.max(0, this.selectedStoryIndex - 1));
    }
  }

  toJSON() {
    return _.pick(this, ['stories', 'selectedStoryIndex']);
  }

}

App.saveDelay = 250;

App.restore = function () {
  let app = JSON.parse(localStorage.getItem('flipbook-manifest'));
  if (!app) {
    // The default app for brand new sessions
    return new App();
  } else {
    return new App(app);
  }
};

export default App;
