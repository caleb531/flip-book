import StoryHeaderComponent from './story-header.js';
import StoryEditorComponent from './story-editor.js';

class StoryComponent {

  view({attrs: {app, story}}) {
    return m('div.story', [
      m(StoryHeaderComponent, {app, story}),
      m(StoryEditorComponent, {story})
    ]);
  }

}

export default StoryComponent;
