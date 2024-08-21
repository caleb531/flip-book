import _ from 'underscore';
import Story from './story.js';
import StoryMetadata from './story-metadata.js';
import appStorage from './app-storage.js';

class App {
  constructor({ stories = [new StoryMetadata()], selectedStoryIndex = 0 } = {}) {
    this.stories = stories.map((storyMetadata) => new StoryMetadata(storyMetadata));
    this.selectedStoryIndex = selectedStoryIndex || 0;
  }

  async save() {
    await appStorage.set('flipbook-manifest', this);
  }

  async selectStory(storyIndex) {
    this.selectedStoryIndex = storyIndex || 0;
    this.selectedStory = await this.getStoryFromStorage(
      this.getSelectedStoryMetadata().createdDate
    );
    this.selectedStory.metadata = this.getSelectedStoryMetadata();
  }

  async loadSelectedStory() {
    return this.selectStory(this.selectedStoryIndex);
  }

  async getSelectedStory() {
    return this.selectedStoryPromise;
  }

  getSelectedStoryMetadata() {
    return this.stories[this.selectedStoryIndex];
  }

  async getSelectedStoryName() {
    return this.selectedStory.metadata.name;
  }

  async renameSelectedStory(newStoryName) {
    let selectedStory = this.selectedStory;
    selectedStory.metadata.name = newStoryName;
    await this.save();
  }

  async getStoryFromStorage(storyId) {
    let story = await appStorage.get(`flipbook-story-${storyId}`);
    if (!story) {
      return new Story();
    } else {
      return new Story(story);
    }
  }

  async createNewStoryWithName(storyName) {
    this.stories.unshift(
      new StoryMetadata({
        name: storyName
      })
    );
    await this.selectStory(0);
    await this.save();
  }

  async addExistingStory(story) {
    await story.save();
    this.stories.unshift(story.metadata);
    await this.selectStory(0);
    await this.save();
  }

  async deleteSelectedStory() {
    if (this.stories.length === 1) {
      this.stories.splice(this.selectedStoryIndex, 1, new StoryMetadata());
      await this.selectStory(0);
    } else {
      this.stories.splice(this.selectedStoryIndex, 1);
      await this.selectStory(Math.max(0, this.selectedStoryIndex - 1));
    }
    await this.save();
  }

  toJSON() {
    return _.pick(this, ['stories', 'selectedStoryIndex']);
  }
}

App.saveDelay = 250;

App.restore = async function () {
  let appData = await appStorage.get('flipbook-manifest');
  let app;
  if (!appData) {
    // The default app for brand new sessions
    app = new App();
    await app.save();
    await app.loadSelectedStory();
  } else {
    app = new App(appData);
    await app.loadSelectedStory();
  }
  return app;
};

export default App;
