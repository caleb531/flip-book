import m from 'mithril';
import PanelComponent from './panel.jsx';

class StoryListComponent {

  oninit({attrs: {app}}) {
    this.app = app;
  }

  async selectStory(storyItemElement) {
    await this.app.selectStory(Number(storyItemElement.dataset.index));
    await this.app.save();
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
