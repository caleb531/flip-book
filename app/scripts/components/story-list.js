import ControlComponent from './control.js';

class StoryListComponent {

  createStory(app) {
    let storyName = prompt('Please enter a name for your new story:');
    if (storyName) {
      app.createStory(storyName);
    }
  }

  selectStory(app, storyItemElement) {
    app.selectStory(Number(storyItemElement.dataset.index));
  }

  view({attrs: {app}}) {
    return m('div.story-list-container', [
      m('div.story-list-header', [
        m('h2', 'Story List'),
        m('div.control-group', [
          m(ControlComponent, {
            id: 'create-new-story',
            title: 'Create New Story',
            icon: 'add',
            action: () => this.createStory(app)
          })
        ])
      ]),
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
