import FrameComponent from './frame.js';
import DrawingAreaComponent from './drawing-area.js';
import StoryControlsComponent from './story-controls.js';

class StoryEditorComponent {

  view({attrs: {story}}) {
    return m('div.story-editor', {
      class: story.playing ? 'story-playing' : ''
    }, [

      m('div.story-stage', [
        story.getPreviousFrame() && story.showPreviousFrame ? m(FrameComponent, {
          className: 'previous-frame',
          frame: story.getPreviousFrame(),
        }) : null,
        m(DrawingAreaComponent, {
          className: 'selected-frame',
          frame: story.getSelectedFrame(),
          drawingEnabled: !story.playing,
          save: () => story.save()
        }),
      ]),

      m(StoryControlsComponent, {story})

    ]);
  }

}

export default StoryEditorComponent;
