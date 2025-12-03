import clsx from 'clsx';
import DrawingAreaComponent from './drawing-area.jsx';
import FrameComponent from './frame.jsx';
import StoryControlsComponent from './story-controls.jsx';

class StoryEditorComponent {
  view({ attrs: { story } }) {
    return (
      <div
        className={clsx('story-editor', { 'story-playing': story.playing })}
        role="region"
        aria-label="Story editor"
      >
        <div className="story-stage">
          {story.selectedFrameIndex > 0 && story.numPreviousFramesToShow > 0
            ? story.getPreviousFramesToShow().map((previousFrame, p, previousFramesToShow) => {
                return (
                  <FrameComponent
                    className={`previous-frame previous-frame-${previousFramesToShow.length - p}`}
                    key={`previous-frame-${previousFrame.temporaryId}`}
                    frame={previousFrame}
                  />
                );
              })
            : null}
          <DrawingAreaComponent
            className="selected-frame"
            story={story}
            frame={story.getSelectedFrame()}
            drawingEnabled={!story.playing}
          />
        </div>
        <StoryControlsComponent story={story} />
      </div>
    );
  }
}

export default StoryEditorComponent;
