import Frame from './frame.js';

class App {

  constructor({stories, selectedStoryIndex}) {
    this.stories = stories;
    this.selectedStoryIndex = selectedStoryIndex;
    this.upgradeToMultiStoryFormat();
  }

  saveManifest() {
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
    let selectedStoryId = this.getSelectedStoryId();
    this.selectedStoryData = this.loadStory(selectedStoryId);
    this.storyEditor.setStory(this.selectedStoryData);
    this.selectedStoryNameElement.innerText = this.getSelectedStory().name;
    this.saveManifest();
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
    // The default story for brand new sessions
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
