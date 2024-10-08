import m from 'mithril';
import GIF from 'gif.js.optimized';
import GIFWorkerUrl from 'gif.js.optimized/dist/gif.worker.js?url';
import FrameComponent from './frame.jsx';
import ControlComponent from './control.jsx';
import ProgressBarComponent from './progress-bar.jsx';
import ExportGifComponent from './export-gif.jsx';

class ExportComponent {
  exportGif(story) {
    this.gifGenerator = new GIF({
      workers: 2,
      workerScript: GIFWorkerUrl
    });
    story.frames.forEach((frame) => {
      let canvas = document.createElement('canvas');
      canvas.width = Math.ceil(
        FrameComponent.width * (story.exportedGifSize / FrameComponent.height)
      );
      canvas.height = story.exportedGifSize;
      let frameComponent = new FrameComponent();
      frameComponent.oninit({ attrs: { frame } });
      frameComponent.oncreate({ dom: canvas });
      frameComponent.render({
        backgroundColor: '#fff'
      });
      this.gifGenerator.addFrame(canvas, { delay: story.frameDuration });
    });
    this.gifGenerator.on('progress', (currentProgress) => {
      this.exportProgress = currentProgress;
      m.redraw();
    });
    this.gifGenerator.on('finished', (blob) => {
      let image = new Image();
      image.onload = () => {
        // Aribtrarily wait half a second before loading to give the progress bar
        // time to reach 100%
        setTimeout(() => {
          this.exportedImageUrl = image.src;
          m.redraw();
        }, ProgressBarComponent.delay);
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
      this.gifGenerator = null;
    }
  }

  exportProject(story) {
    // The story metadata is not returned by toJSON() so that the information is
    // not duplicated in localStorage (the story metadata is already stored in
    // the app manifest); reconstruct the object with the metadata key added
    // first, since ES6 preserves object key order
    let storyJson = Object.assign({ metadata: story.metadata }, story.toJSON());
    // When we import the story somewhere else, it would be more convenient for
    // the first frame to be selected
    delete storyJson.selectedFrameIndex;
    let slugName = story.metadata.name
      .toLowerCase()
      .replace(/(^\W+)|(\W+$)/gi, '')
      .replace(/\W+/gi, '-');
    let blob = new Blob([JSON.stringify(storyJson)]);
    let a = document.createElement('a');
    a.href = URL.createObjectURL(blob, { type: 'application/json' });
    a.download = `${slugName}.flipbook`;
    a.click();
  }

  async setExportedGifSize(story, size) {
    story.exportedGifSize = Number(size);
    await story.save();
  }

  view({ attrs: { story } }) {
    return (
      <div className="export-options">
        <h2>Export</h2>
        <div className="exported-gif-controls">
          <ControlComponent
            id="export-gif"
            title="Export GIF"
            label="Export GIF"
            action={() => this.exportGif(story)}
          />
          <div className="exported-gif-size">
            <label htmlFor="exported-gif-size">GIF Size:</label>
            <select
              id="exported-gif-size"
              onchange={({ target }) => this.setExportedGifSize(story, target.value)}
            >
              {ExportComponent.exportedGifSizes.map((size) => {
                return (
                  <option selected={size === story.exportedGifSize} value={size}>
                    {`${Math.ceil(FrameComponent.width * (size / FrameComponent.height))} x ${size}`}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <ControlComponent
          id="export-project"
          title="Export Project Data"
          label="Export Project Data"
          action={() => this.exportProject(story)}
        />
        <ExportGifComponent
          isExportingGif={this.isExportingGif()}
          isGifExportFinished={this.isGifExportFinished()}
          exportProgress={this.exportProgress}
          exportedImageUrl={this.exportedImageUrl}
          abort={() => this.abortGifExport()}
        />
      </div>
    );
  }
}

// The list of sizes at which the story can be exported as a GIF; each value
// corresponds to the height of the exported GIF
ExportComponent.exportedGifSizes = [1080, 720, 540, 360];

export default ExportComponent;
