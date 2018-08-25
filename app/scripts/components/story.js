import StoryHeaderComponent from './story-header.js';
import StoryEditorComponent from './story-editor.js';

class StoryComponent {

  navigateFramesViaKeyboard(story, key) {
    if (key === 'ArrowLeft') {
      story.selectPreviousFrame();
    } else if (key === 'ArrowRight') {
      story.selectNextFrame();
    }
  }

  view({attrs: {app, story}}) {
    return m('div.story[tabindex=-1]', {
      oncreate: ({dom}) => dom.focus(),
      onupdate: ({dom}) => dom.focus(),
      onkeydown: ({key}) => this.navigateFramesViaKeyboard(story, key)
    }, [
      m(StoryHeaderComponent, {app, story}),
      m(StoryEditorComponent, {story})
    ]);
  }

}

export default StoryComponent;
