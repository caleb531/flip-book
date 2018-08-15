import StoryEditor from './story-editor.js';
import Frame from './frame.js';

class App {

  constructor() {
    this.storyEditor = new StoryEditor({
      editorElement: document.querySelector('.story-editor'),
      onSave: (storyData) => {
        this.saveStory(this.getSelectedStoryId(), storyData);
      }
    });
    this.storyListElement = document.querySelector('.story-list');
    this.appManifest = this.getAppManifest();
    this.saveManifest();
    // Select the most recent story by default
    this.setSelectedStory(this.appManifest.stories.length - 1);
    this.displayStories();
  }

  getAppManifest() {
    let manifest = JSON.parse(localStorage.getItem('flipbook-manifest'));
    if (!manifest) {
      // The default story for brand new sessions
      manifest = {
        stories: [
          {
            createdDate: Date.now(),
            name: 'My First Story',
            lastUpdatedDate: Date.now()
          },
          {
            createdDate: Date.now() + 1,
            name: 'My Second Story',
            lastUpdatedDate: Date.now() + 1
          }
        ]
      };
    } else {
      // The order of the array elements is the reverse of
      manifest.stories.sort((storyA, storyB) => {
        return storyB.lastUpdatedDate - storyA.lastUpdatedDate;
      });
    }
    return manifest;
  }

  saveManifest() {
    localStorage.setItem(`flipbook-manifest`, JSON.stringify(this.appManifest));
  }

  setSelectedStory(storyIndex) {
    this.selectedStoryIndex = storyIndex;
    let selectedStoryId = this.getSelectedStoryId();
    this.selectedStoryData = this.loadStory(selectedStoryId);
    this.storyEditor.setStory(this.selectedStoryData);
  }

  getSelectedStoryId() {
    return this.appManifest.stories[this.selectedStoryIndex].createdDate;
  }

  loadStory(storyId) {
    let storyData = JSON.parse(localStorage.getItem(`flipbook-story-${storyId}`));
    if (!storyData) {
      storyData = {
        frames: [new Frame()],
        selectedFrameIndex: 0,
        frameDuration: 100,
        showPreviousFrame: true
      };
    }
    return storyData;
  }

  saveStory(storyId, storyData) {
    clearTimeout(this.autosaveTimer);
    this.autosaveTimer = setTimeout(() => {
      localStorage.setItem(`flipbook-story-${storyId}`, JSON.stringify(storyData));
    }, App.saveDelay);
  }

  displayStories() {
    for (let s = 0; s < this.appManifest.stories.length; s += 1) {
      let story = this.appManifest.stories[s];
      let storyElement = document.createElement('div');
      storyElement.classList.add('story-list-item');
      let storyNameElement = document.createElement('div');
      storyNameElement.append(story.name);
      storyNameElement.classList.add('story-list-item-name');
      storyElement.append(storyNameElement);
      this.storyListElement.append(storyElement);
    }
  }

}

App.saveDelay = 250;

export default App;
