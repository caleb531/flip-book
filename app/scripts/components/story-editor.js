import DrawingAreaComponent from './drawing-area.js';
import StoryControlsComponent from './story-controls.js';

class StoryEditorComponent {

  oninit({attrs: {story, onSave}}) {
    this.story = story;
    if (onSave) {
      this.onSave = onSave;
    }
  }

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

  scrollThumbnailIntoView(thumbnailCanvas) {
    let thumbnailContainer = thumbnailCanvas.parentElement;
    let scrollLeft = this.timelineElement.scrollLeft;
    let scrollRight = scrollLeft + this.timelineElement.offsetWidth;
    let offsetLeft = thumbnailContainer.offsetLeft;
    let offsetRight = thumbnailContainer.offsetLeft + thumbnailContainer.offsetWidth;

    if (offsetRight > scrollRight) {
      this.timelineElement.scrollLeft += offsetRight - scrollRight;
    } else if (offsetLeft < scrollLeft) {
      this.timelineElement.scrollLeft += offsetLeft - scrollLeft;
    }

  }

  save() {
    if (this.onSave) {
      this.onSave(this.story);
    }
  }

  view() {
    return m('div.story-editor', {
      class: this.story.playing ? 'story-playing' : ''
    }, [

      m(DrawingAreaComponent, {
        selectedFrame: this.story.getSelectedFrame(),
        previousFrame: this.story.getPreviousFrame(),
        showPreviousFrame: this.story.showPreviousFrame,
        drawingEnabled: !this.story.playing,
        onEndDraw: () => this.save()
      }),

      m(StoryControlsComponent, {
        story: this.story
      })

    ]);
  }

}

export default StoryEditorComponent;
