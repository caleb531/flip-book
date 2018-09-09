import classNames from '../classnames.js';
import FrameComponent from './frame.js';
import PanelComponent from './panel.js';

class TimelineComponent {

  selectThumbnail(target, story) {
    if (target.dataset.index) {
      story.selectFrame(Number(target.dataset.index));
      this.scrollSelectedThumbnailIntoView(target);
      story.save();
    }
    PanelComponent.closeAllPanels();
  }

  scrollSelectedThumbnailIntoView(thumbnailElement) {
    if (thumbnailElement.classList.contains('selected')) {
      let timelineElement = thumbnailElement.parentElement;
      let scrollLeft = timelineElement.scrollLeft;
      let scrollRight = scrollLeft + timelineElement.offsetWidth;
      let offsetLeft = thumbnailElement.offsetLeft;
      let offsetRight = thumbnailElement.offsetLeft + thumbnailElement.offsetWidth;

      if (offsetRight > scrollRight) {
        timelineElement.scrollLeft += offsetRight - scrollRight;
      } else if (offsetLeft < scrollLeft) {
        timelineElement.scrollLeft += offsetLeft - scrollLeft;
      }
    }
  }

  handleFrameDragstart(event) {
    if (event.target.dataset.index) {
      this.mousedown = true;
      this.oldFrameIndex = Number(event.target.dataset.index);
    }
    event.redraw = false;
  }

  handleFrameDragover(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }

  getNearestX(xValue, roundValue) {
    return Math.round(xValue / roundValue) * roundValue;
  }

  handleFrameDragmove(event) {
    event.preventDefault();
    if (event.target.dataset.index) {
      let thumbnailWidth = event.target.offsetWidth;
      let currentX = event.pageX - event.target.parentElement.offsetLeft;
      console.log(this.getNearestX(currentX, thumbnailWidth));
    }
  }

  handleFrameDrop(event, story) {
    event.preventDefault();
    if (this.mousedown) {
      this.mousedown = false;
      if (event.target.dataset.index) {
        this.newFrameIndex = Number(event.target.dataset.index);
        story.moveFrame(this.oldFrameIndex, this.newFrameIndex);
        story.selectFrame(this.newFrameIndex);
        story.save();
      }
    } else {
      event.redraw = false;
    }
  }

  view({attrs: {story}}) {
    return m('ol.timeline', {
      onclick: ({target}) => this.selectThumbnail(target, story),
      ondragstart: (event) => this.handleFrameDragstart(event),
      ondrag: (event) => this.handleFrameDragmove(event),
      ondragover: (event) => this.handleFrameDragover(event),
      ondrop: (event) => this.handleFrameDrop(event, story)
    }, story.frames.map((frame, f) => {
      return m('li.timeline-thumbnail', {
        draggable: true,
        // Keying each thumbnail prevents the canvas redraws from compounding
        key: frame.temporaryId,
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
