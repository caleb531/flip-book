import FrameComponent from './frame.js';
import ControlComponent from './control.js';
import ProgressBarComponent from './progress-bar.js';
import ExportGifComponent from './export-gif.js';

class ExportComponent {

  exportGif(story) {
    this.gifGenerator = new GIF({
      workers: 2,
      workerScript: 'scripts/gif.worker.js'
    });
    story.frames.forEach((frame) => {
      let canvas = document.createElement('canvas');
      canvas.width = FrameComponent.width * (story.exportedGifSize / FrameComponent.height);
      canvas.height = story.exportedGifSize;
      let frameComponent = new FrameComponent();
      frameComponent.oninit({attrs: {frame}});
      frameComponent.oncreate({dom: canvas});
      frameComponent.render({
        backgroundColor: '#fff'
      });
      this.gifGenerator.addFrame(canvas, {delay: story.frameDuration});
    });
    this.gifGenerator.on('progress', (currentProgress) => {
      this.exportProgress = currentProgress;
      m.redraw();
    });
    this.gifGenerator.on('finished', (blob) => {
      let image = new Image();
      image.onload = () => {
        this.exportedImageUrl = image.src;
        // Aribtrarily wait half a second before loading to give the progress bar
        // time to reach 100%
        setTimeout(() => m.redraw(), ProgressBarComponent.delay);
      };
      image.src = URL.createObjectURL(blob);
    });
    this.exportedImageUrl = null;
    this.gifGenerator.render();
  }

  isExportingGif() {
    if (this.gifGenerator) {
      return this.gifGenerator.running;
    } else {
      return false;
    }
  }

  isGifExportFinished() {
    if (this.gifGenerator) {
      return this.gifGenerator.finishedFrames === this.gifGenerator.frames.length;
    } else {
      return false;
    }
  }

  abortGifExport() {
    if (this.gifGenerator) {
      this.gifGenerator.abort();
      this.gifGenerator = false;
    }
  }

  exportProject(story) {
    // The story metadata is not returned by toJSON() so that the information is
    // not duplicated in localStorage (the story metadata is already stored in
    // the app manifest); reconstruct the object with the metadata key added
    // first, since ES6 preserves object key order
    let storyJson = Object.assign({metadata: story.metadata}, story.toJSON());
    // When we import the story somewhere else, it would be more convenient for
    // the first frame to be selected
    delete storyJson.selectedFrameIndex;
    let slugName = story.metadata.name
      .toLowerCase()
      .replace(/(^\W+)|(\W+$)/gi, '')
      .replace(/\W+/gi, '-');
    let blob = new Blob([JSON.stringify(storyJson)]);
    let a = document.createElement('a');
    a.href = URL.createObjectURL(blob, {type: 'application/json'});
    a.download = `${slugName}.flipbook`;
    a.click();
  }

  setExportedGifSize(story, size) {
    story.exportedGifSize = Number(size);
    story.save();
  }

  view({attrs: {story}}) {
    return m('div.export-options', [
      m('h2', 'Export'),
      m('div.exported-gif-controls', [
        m(ControlComponent, {
          id: 'export-gif',
          title: 'Export GIF',
          label: 'Export GIF',
          action: () => this.exportGif(story)
        }),
        m('div.exported-gif-size', [
          m('label[for=exported-gif-size]', 'GIF Size:'),
          m('select#exported-gif-size', {
            onchange: ({target}) => this.setExportedGifSize(story, target.value)
          }, ExportComponent.exportedGifSizes.map((size) => {
            return m('option', {
              selected: size === story.exportedGifSize,
              value: size
            }, `${FrameComponent.width * (size / FrameComponent.height)} x ${size}`);
          }))
        ])
      ]),
      m(ControlComponent, {
        id: 'export-project',
        title: 'Export Project',
        label: 'Export Project',
        action: () => this.exportProject(story)
      }),
      m(ExportGifComponent, {
        isExportingGif: this.isExportingGif(),
        isGifExportFinished: this.isGifExportFinished(),
        exportProgress: this.exportProgress,
        exportedImageUrl: this.exportedImageUrl,
        abort: () => this.abortGifExport()
      })
    ]);
  }

}

// The list of sizes the story can be exported at; each value is a fraction of
// the default frame width/height
ExportComponent.exportedGifSizes = [1080, 720, 540, 360];


export default ExportComponent;
