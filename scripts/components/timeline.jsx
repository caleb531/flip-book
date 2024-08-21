import clsx from 'clsx';
import FrameComponent from './frame.jsx';

const FRAME_THUMBNAIL_WIDTH = 128;
const FRAME_THUMBNAIL_HEIGHT = 72;

class TimelineComponent {
  async selectThumbnail(target, story) {
    if (target.dataset.index) {
      story.selectFrame(Number(target.dataset.index));
      this.scrollSelectedThumbnailIntoView(target);
      await story.save();
    }
  }

  scrollSelectedThumbnailIntoView(thumbnailElement) {
    if (thumbnailElement.classList.contains('selected')) {
      let timelineElement = thumbnailElement.parentElement;
      let scrollLeft = timelineElement.scrollLeft;
      let scrollRight = scrollLeft + timelineElement.offsetWidth;
      let offsetLeft = thumbnailElement.offsetLeft;
      let offsetRight = thumbnailElement.offsetLeft + thumbnailElement.offsetWidth;

      // If the visible timeline is not wide enough to show a full thumbnail,
      // do nothing
      if (timelineElement.offsetWidth < thumbnailElement.offsetWidth) {
        return;
      }

      if (offsetRight > scrollRight) {
        timelineElement.scrollLeft += offsetRight - scrollRight;
      } else if (offsetLeft < scrollLeft) {
        timelineElement.scrollLeft += offsetLeft - scrollLeft;
      }
    }
  }

  handleFrameDragstart(event) {
    if (event.target.dataset.index) {
      this.oldFrameIndex = Number(event.target.dataset.index);
    }
    event.redraw = false;
  }

  async handleFrameDragenter(event, story) {
    event.preventDefault();
    event.redraw = false;
    if (event.target.dataset.index) {
      this.newFrameIndex = Number(event.target.dataset.index);
      if (this.newFrameIndex !== story.selectedFrameIndex) {
        story.moveFrame(this.oldFrameIndex, this.newFrameIndex);
        story.selectFrame(this.newFrameIndex);
        this.oldFrameIndex = this.newFrameIndex;
        await story.save();
        // Do not defer the next redraw
        delete event.redraw;
      }
    }
  }

  handleFrameDragover(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    event.redraw = false;
  }

  handleFrameDrop(event) {
    // This placeholder handler simply exists to allow Mithril to automatically
    // redraw the timeline when the thumbnail is dropped into its new location
    // (simply by virtue of the event listener existing)
  }

  view({ attrs: { story } }) {
    return (
      <ol
        className="timeline"
        onclick={({ target }) => this.selectThumbnail(target, story)}
        ondragstart={(event) => this.handleFrameDragstart(event)}
        ondragover={(event) => this.handleFrameDragover(event, story)}
        ondragenter={(event) => this.handleFrameDragenter(event, story)}
        ondrop={(event) => this.handleFrameDrop(event, story)}
      >
        {story.frames.map((frame, f) => {
          return (
            <li
              draggable={true}
              key={`timeline-thumbnail-${frame.temporaryId}`}
              oncreate={({ dom }) => this.scrollSelectedThumbnailIntoView(dom)}
              onupdate={({ dom }) => this.scrollSelectedThumbnailIntoView(dom)}
              className={clsx('timeline-thumbnail', {
                selected: story.selectedFrameIndex === f
              })}
              data-index={f}
            >
              <FrameComponent
                className="timeline-thumbnail-canvas"
                frame={frame}
                width={FRAME_THUMBNAIL_WIDTH}
                height={FRAME_THUMBNAIL_HEIGHT}
              />
            </li>
          );
        })}
      </ol>
    );
  }
}

export default TimelineComponent;
