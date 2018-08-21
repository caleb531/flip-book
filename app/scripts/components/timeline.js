import FrameComponent from './frame.js';

class TimelineComponent {

  oninit({attrs: {save}}) {
    this.save = save;
  }

  selectFrame(story, frameIndex) {
    if (Number.isInteger(frameIndex)) {
      story.setSelectedFrame(frameIndex);
      this.save();
    }
  }

  view({attrs: {story}}) {
    return m('ol.timeline', {
      onclick: (event) => this.selectFrame(story, Number(event.target.dataset.index))
    }, story.frames.map((frame, f) => {
      return m('li.timeline-thumbnail', {
        // Keying each thumbnail prevents the canvas redraws from compounding
        key: frame.temporaryId,
        class: story.selectedFrameIndex === f ? 'selected' : '',
        'data-index': f
      }, m(FrameComponent, {
        className: 'timeline-thumbnail-canvas',
        frame: frame,
        width: 128,
        height: 72
      }));
    }));
  }

}

export default TimelineComponent;
