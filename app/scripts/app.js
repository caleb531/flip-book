import StoryEditor from './story-editor.js';
import Frame from './frame.js';

class App {

  constructor({appElement}) {
    this.appElement = appElement;
    this.storyEditor = new StoryEditor({
      editorElement: this.querySelector('.story-editor'),
      onSave: (storyData) => {
        clearTimeout(this.autosaveTimer);
        this.autosaveTimer = setTimeout(() => {
          this.saveStory(this.getSelectedStoryId(), storyData);
        }, this.saveDelay);
      }
    });
    this.managerPanelElement = this.querySelector('.manager-panel');
    this.selectedStoryNameElement = this.querySelector('.selected-story-name');
    this.storyListElement = this.querySelector('.story-list');
    this.appManifest = this.getAppManifest();
    this.saveManifest();
    // Select the most recent story by default
    this.upgradeToMultiStoryFormat();
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
        stories: [{
          createdDate: Date.now(),
          name: 'My First Story',
          lastUpdatedDate: Date.now()
        }]
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

  upgradeToMultiStoryFormat() {
    if (localStorage.getItem('flipbook-storage-version') !== '2') {
      let oldStoryData = JSON.parse(localStorage.getItem('flipbook-story'));
      if (oldStoryData) {
        this.saveStory(this.getStoryId(0), oldStoryData);
        localStorage.setItem('flipbook-storage-version', '2');
      }
    }
  }

  setSelectedStory(storyIndex) {
    this.selectedStoryIndex = storyIndex;
    let selectedStoryId = this.getSelectedStoryId();
    this.selectedStoryData = this.loadStory(selectedStoryId);
    this.storyEditor.setStory(this.selectedStoryData);
    this.selectedStoryNameElement.innerText = this.getSelectedStory().name;
  }

  getSelectedStory() {
    return this.appManifest.stories[this.selectedStoryIndex];
  }
  getSelectedStoryId() {
    return this.getStoryId(this.selectedStoryIndex);
  }
  getStoryId(storyIndex) {
    return this.appManifest.stories[storyIndex].createdDate;
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
    localStorage.setItem(`flipbook-story-${storyId}`, JSON.stringify(storyData));
  }

  displayStories() {
    for (let s = 0; s < this.appManifest.stories.length; s += 1) {
      let story = this.appManifest.stories[s];
      this.addStoryForDisplay(story, s);
    }
  }

  addStoryForDisplay(story, s) {
    let storyElement = document.createElement('div');
    storyElement.classList.add('story-list-item');
    storyElement.setAttribute('data-list-index', s);
    let storyNameElement = document.createElement('div');
    storyNameElement.append(story.name);
    storyNameElement.classList.add('story-list-item-name');
    storyElement.append(storyNameElement);
    this.storyListElement.prepend(storyElement);
  }

  bindEvents() {
    this.querySelector('.control-manage-my-stories').addEventListener('click', () => {
      this.managerPanelElement.classList.toggle('panel-open');
    });
    this.storyListElement.addEventListener('click', (event) => {
      if (event.target.classList.contains('story-list-item-name')) {
        this.querySelector('.manager-panel').classList.remove('panel-open');
        this.setSelectedStory(Number(event.target.parentElement.getAttribute('data-list-index')));
      }
    });
    this.querySelector('.control-add-story').addEventListener('click', () => {
      let storyName = prompt('Please enter a name for your new story:');
      if (storyName !== null) {
        let story = {
          createdDate: Date.now(),
          name: storyName || 'My New Story',
          lastUpdatedDate: Date.now()
        };
        this.appManifest.stories.push(story);
        this.addStoryForDisplay(story, this.appManifest.stories.length - 1);
        this.setSelectedStory(this.appManifest.stories.length - 1);
        this.saveManifest();
        this.managerPanelElement.classList.toggle('panel-open');
      }
    });
  }

}

App.saveDelay = 250;

export default App;
