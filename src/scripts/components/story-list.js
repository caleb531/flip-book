import PanelComponent from './panel.js';

class StoryListComponent {

  oninit({attrs: {app}}) {
    this.app = app;
  }

  selectStory(storyItemElement) {
    this.app.selectStory(Number(storyItemElement.dataset.index));
    this.app.save();
    PanelComponent.closeAllPanels();
  }

  view() {
    return m('div.story-list-container', [
      m('h2', 'Story List'),
      m('ul.story-list', {
        onclick: ({target}) => this.selectStory(target.closest('.story-list-item'))
      }, this.app.stories.map((storyMetadata, s) => {
        return m('li.story-list-item', {
          'data-index': s
        }, storyMetadata.name);
      }))
    ]);
  }

}

export default StoryListComponent;
