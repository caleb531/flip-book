import FrameComponent from './frame.js';
import DrawingAreaComponent from './drawing-area.js';
import StoryControlsComponent from './story-controls.js';

class StoryEditorComponent {

  exportToGIF() {
    this.gifGenerator = new GIF({
      workers: 2,
      workerScript: 'scripts/gif.worker.js'
    });
    for (let f = 0; f < this.story.frames.length; f += 1) {
      let canvas = document.createElement('canvas');
      canvas.width = DrawingAreaComponent.width;
      canvas.height = DrawingAreaComponent.height;
      this.story.frames[f].render(canvas.getContext('2d'), {
        backgroundColor: '#fff'
      });
      this.gifGenerator.addFrame(canvas, {delay: this.story.frameDuration});
    }
    this.gifGenerator.on('finished', (blob) => {
      let image = new Image();
      image.onload = () => {
        this.exportLoaded = true;
        this.exportedImageSrc = image.src;
        m.redraw();
      };
      image.src = URL.createObjectURL(blob);
      m.redraw();
    });

    m.redraw();
    this.gifGenerator.render();

  }

  view({attrs: {story, save = () => {}}}) {
    return m('div.story-editor', {
      class: story.playing ? 'story-playing' : ''
    }, [

      m('div.story-stage', [
        story.getPreviousFrame() ? m(FrameComponent, {
          className: 'previous-frame',
          frame: story.getPreviousFrame(),
        }) : null,
        m(DrawingAreaComponent, {
          className: 'selected-frame',
          frame: story.getSelectedFrame(),
          drawingEnabled: !story.playing,
          save
        }),
      ]),

      m(StoryControlsComponent, {story, save})

    ]);
  }

}

export default StoryEditorComponent;
