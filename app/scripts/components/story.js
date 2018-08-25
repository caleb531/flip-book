import StoryHeaderComponent from './story-header.js';
import StoryEditorComponent from './story-editor.js';

class StoryComponent {

  navigateFramesViaKeyboard(event, story) {
    if (event.key === 'ArrowLeft') {
      story.selectPreviousFrame();
    } else if (event.key === 'ArrowRight') {
      story.selectNextFrame();
    } else {
      event.redraw = false;
    }
  }

  view({attrs: {app, story}}) {
    return m('div.story[tabindex=-1]', {
      oncreate: ({dom}) => dom.focus(),
      onupdate: ({dom}) => dom.focus(),
      onkeydown: (event) => this.navigateFramesViaKeyboard(event, story)
    }, [
      m(StoryHeaderComponent, {app, story}),
      m(StoryEditorComponent, {story})
    ]);
  }

}

export default StoryComponent;
