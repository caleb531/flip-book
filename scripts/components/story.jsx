import m from 'mithril';
import StoryHeaderComponent from './story-header.jsx';
import StoryEditorComponent from './story-editor.jsx';

class StoryComponent {

  view({attrs: {app, story}}) {
    return m('div.story', [
      m(StoryHeaderComponent, {app, story}),
      m(StoryEditorComponent, {story})
    ]);
  }

}

export default StoryComponent;
