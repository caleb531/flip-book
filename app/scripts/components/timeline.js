import FrameComponent from './frame.js';
import PanelComponent from './panel.js';

class TimelineComponent {

  selectThumbnail(event, story) {
    if (event.target.dataset.index) {
      story.selectFrame(Number(event.target.dataset.index));
      this.scrollSelectedThumbnailIntoView(event.target);
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

  view({attrs: {story}}) {
    return m('ol.timeline', {
      onclick: (event) => this.selectThumbnail(event, story)
    }, story.frames.map((frame, f) => {
      return m('li.timeline-thumbnail', {
        // Keying each thumbnail prevents the canvas redraws from compounding
        key: frame.temporaryId,
        // Scroll newly-added frames into view
        oncreate: ({dom}) => this.scrollSelectedThumbnailIntoView(dom),
        // Scroll selected frame into view when navigating frames (Prev/Next)
        onupdate: ({dom}) => this.scrollSelectedThumbnailIntoView(dom),
        class: story.selectedFrameIndex === f ? 'selected' : '',
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
