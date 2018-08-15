import StoryEditor from './story-editor.js';
import Frame from './frame.js';

class App {

  constructor({appElement}) {
    this.appElement = appElement;
    this.storyEditor = new StoryEditor({
      editorElement: this.querySelector('.story-editor'),
      onSave: (storyData) => {
        this.saveStory(this.getSelectedStoryId(), storyData);
      }
    });
    this.storyListElement = this.querySelector('.story-list');
    this.appManifest = this.getAppManifest();
    this.saveManifest();
    // Select the most recent story by default
    this.setSelectedStory(this.appManifest.stories.length - 1);
    this.displayStories();
    this.bindEvents();
  }

  querySelector(selector) {
    return this.appElement.querySelector(selector);
  }

  getAppManifest() {
    let manifest = JSON.parse(localStorage.getItem('flipbook-manifest'));
    if (!manifest) {
      // The default story for brand new sessions
      manifest = {
        stories: [
          {
            createdDate: Date.now() - 2,
            name: 'My Third Story',
            lastUpdatedDate: Date.now() - 2
          },
          {
            createdDate: Date.now() - 1,
            name: 'My Second Story',
            lastUpdatedDate: Date.now() - 1
          },
          {
            createdDate: Date.now(),
            name: 'My First Story',
            lastUpdatedDate: Date.now()
          }
        ]
      };
    } else {
      // The order of the array elements is the reverse of the display order
      manifest.stories.sort((storyA, storyB) => {
        return storyA.createdDate - storyB.createdDate;
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
    for (let s = this.appManifest.stories.length - 1; s >= 0; s -= 1) {
      let story = this.appManifest.stories[s];
      let storyElement = document.createElement('div');
      storyElement.classList.add('story-list-item');
      storyElement.setAttribute('data-list-index', s);
      let storyNameElement = document.createElement('div');
      storyNameElement.append(story.name);
      storyNameElement.classList.add('story-list-item-name');
      storyElement.append(storyNameElement);
      this.storyListElement.append(storyElement);
    }
  }

  bindEvents() {
    this.storyListElement.addEventListener('click', (event) => {
      if (event.target.classList.contains('story-list-item-name')) {
        this.querySelector('.manager-panel').classList.remove('panel-open');
        this.setSelectedStory(Number(event.target.parentElement.getAttribute('data-list-index')));
      }
    });
  }

}

App.saveDelay = 250;

export default App;
