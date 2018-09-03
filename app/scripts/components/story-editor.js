import classNames from '../classnames.js';
import FrameComponent from './frame.js';
import DrawingAreaComponent from './drawing-area.js';
import StoryControlsComponent from './story-controls.js';

class StoryEditorComponent {

  view({attrs: {story}}) {
    return m('div.story-editor', {
      class: classNames({'story-playing': story.playing})
    }, [

      m('div.story-stage', [
        story.getPreviousFrame() && story.showPreviousFrame ? m(FrameComponent, {
          className: 'previous-frame',
          frame: story.getPreviousFrame(),
        }) : null,
        m(DrawingAreaComponent, {
          className: 'selected-frame',
          story,
          frame: story.getSelectedFrame(),
          drawingEnabled: !story.playing
        }),
      ]),

      m(StoryControlsComponent, {story})

    ]);
  }

}

export default StoryEditorComponent;
