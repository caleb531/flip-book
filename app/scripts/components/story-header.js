import ControlComponent from './control.js';
import StoryListComponent from './story-list.js';

class StoryHeaderComponent {

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
      m('span.selected-story-name', story.metadata.name)
    ]);
  }

}

export default StoryHeaderComponent;
