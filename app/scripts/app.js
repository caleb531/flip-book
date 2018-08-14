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
    this.appManifest = this.getAppManifest();
    this.saveManifest();
    // Select the most recent story by default
    this.setSelectedStory(this.appManifest.stories.length - 1);
  }

  getAppManifest() {
    let manifest = JSON.parse(localStorage.getItem('flipbook-manifest'));
    if (!manifest) {
      // The default story for brand new sessions
      manifest = {
        stories: [{
          createdDate: Date.now(),
          storyName: 'My First Story',
          lastUpdatedDate: Date.now()
        }]
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

}

App.saveDelay = 250;

export default App;
