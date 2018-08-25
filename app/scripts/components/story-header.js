import ControlComponent from './control.js';
import StoryListComponent from './story-list.js';

class StoryHeaderComponent {

  deleteSelectedStory(app) {
    // Prevent the synchronous confirm() call from blocking the main thread;
    // this will allow Mithril to redraw and close all panels before showing the
    // modal
    setTimeout(() => {
      if (confirm('Are you sure you want to permanently delete this story?')) {
        app.deleteSelectedStory();
        m.redraw();
      }
    });
  }

  view({attrs: {app, story}}) {
    return m('div.story-header', [
      m('.control-group', [
        m(ControlComponent, {
          id: 'story-list',
          title: 'Story List',
          icon: 'folder',
          panel: m(StoryListComponent, {app}),
          panelPosition: 'bottom',
        })
      ]),
      m('span.selected-story-name', story.metadata.name),
      m('.control-group', [
        app.stories.length > 1 ? m(ControlComponent, {
          id: 'delete-story',
          title: 'Delete Story',
          icon: 'delete',
          action: () => this.deleteSelectedStory(app)
        }) : null
      ])
    ]);
  }

}

export default StoryHeaderComponent;
