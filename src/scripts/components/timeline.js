import classNames from '../classnames.js';
import FrameComponent from './frame.js';

class TimelineComponent {

  selectThumbnail(target, story) {
    if (target.dataset.index) {
      story.selectFrame(Number(target.dataset.index));
      this.scrollSelectedThumbnailIntoView(target);
      story.save();
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

  handleFrameDragenter(event, story) {
    event.preventDefault();
    event.redraw = false;
    if (event.target.dataset.index) {
      this.newFrameIndex = Number(event.target.dataset.index);
      if (this.newFrameIndex !== story.selectedFrameIndex) {
        story.moveFrame(this.oldFrameIndex, this.newFrameIndex);
        story.selectFrame(this.newFrameIndex);
        this.oldFrameIndex = this.newFrameIndex;
        story.save();
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
    event.redraw = false;
  }

  view({attrs: {story}}) {
    return m('ol.timeline', {
      onclick: ({target}) => this.selectThumbnail(target, story),
      ondragstart: (event) => this.handleFrameDragstart(event),
      ondragover: (event) => this.handleFrameDragover(event, story),
      ondragenter: (event) => this.handleFrameDragenter(event, story),
      ondrop: (event) => this.handleFrameDrop(event, story)
    }, story.frames.map((frame, f) => {
      return m('li.timeline-thumbnail', {
        draggable: true,
        // Keying each thumbnail prevents the canvas redraws from compounding
        key: `timeline-thumbnail-${frame.temporaryId}`,
        // Scroll newly-added frames into view
        oncreate: ({dom}) => this.scrollSelectedThumbnailIntoView(dom),
        // Scroll selected frame into view when navigating frames (Prev/Next)
        onupdate: ({dom}) => this.scrollSelectedThumbnailIntoView(dom),
        class: classNames({'selected': story.selectedFrameIndex === f}),
        'data-index': f
      }, m(FrameComponent, {
        className: 'timeline-thumbnail-canvas',
        frame,
        width: 128,
        height: 72
      }));
    }));
  }

}

export default TimelineComponent;
