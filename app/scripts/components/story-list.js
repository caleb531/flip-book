import PanelComponent from './panel.js';

class StoryListComponent {

  selectStory(app, storyItemElement) {
    app.selectStory(Number(storyItemElement.dataset.index));
    PanelComponent.closeAllPanels();
  }

  view({attrs: {app}}) {
    return m('div.story-list-container', [
      m('h2', 'Story List'),
      m('ul.story-list', {
        onclick: ({target}) => this.selectStory(app, target.closest('.story-list-item'))
      }, app.stories.map((storyMetadata, s) => {
        return m('li.story-list-item', {
          'data-index': s
        }, storyMetadata.name);
      }))
    ]);
  }

}

export default StoryListComponent;
