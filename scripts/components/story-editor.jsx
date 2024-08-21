import m from 'mithril';
import clsx from 'clsx';
import FrameComponent from './frame.jsx';
import DrawingAreaComponent from './drawing-area.jsx';
import StoryControlsComponent from './story-controls.jsx';

class StoryEditorComponent {

  view({attrs: {story}}) {
    return m('div', {
      class: clsx('story-editor', {'story-playing': story.playing})
    }, [

      m('div.story-stage', [
        story.selectedFrameIndex > 0 && story.numPreviousFramesToShow > 0 ? story.getPreviousFramesToShow().map((previousFrame, p, previousFramesToShow) => {
          return m(FrameComponent, {
            className: `previous-frame previous-frame-${previousFramesToShow.length - p}`,
            key: `previous-frame-${previousFrame.temporaryId}`,
            frame: previousFrame
          });
        }) : null,
        m(DrawingAreaComponent, {
          className: 'selected-frame',
          story,
          frame: story.getSelectedFrame(),
          drawingEnabled: !story.playing
        })
      ]),

      m(StoryControlsComponent, {story})

    ]);
  }

}

export default StoryEditorComponent;
