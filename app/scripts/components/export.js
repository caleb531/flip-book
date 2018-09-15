import FrameComponent from './frame.js';
import ControlComponent from './control.js';
import ProgressBarComponent from './progress-bar.js';
import ExportGifComponent from './export-gif.js';

class ExportComponent {

  exportStoryToGif(story) {
    story.exportGif({
      scale: story.exportedGifSize,
      // Aribtrarily wait half a second before loading to give the progress bar
      // time to reach 100%
      success: () => setTimeout(() => m.redraw(), ProgressBarComponent.delay),
      progress: () => m.redraw()
    });
  }

  exportStoryToProjectFile(story) {
    let slugName = story.metadata.name
      .toLowerCase()
      .replace(/(^\W+)|(\W+$)/gi, '')
      .replace(/\W+/gi, '-');
    let blob = new Blob([story.exportProject()]);
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
          action: () => this.exportStoryToGif(story)
        }),
        m('div.exported-gif-size', [
          m('label[for=exported-gif-size]', 'GIF Size:'),
          m('select#exported-gif-size', {
            onchange: ({target}) => this.setExportedGifSize(story, target.value)
          }, ExportComponent.gifSizes.map((size) => {
            return m('option', {
              selected: size === story.exportedGifSize,
              value: size
            }, `${FrameComponent.width * size} x ${FrameComponent.height * size}`);
          }))
        ])
      ]),
      m(ControlComponent, {
        id: 'export-project',
        title: 'Export Project',
        label: 'Export Project',
        action: () => this.exportStoryToProjectFile(story)
      }),
      m(ExportGifComponent, {story})
    ]);
  }

}

// The list of sizes the story can be exported at; each value is a fraction of
// the default frame width/height
ExportComponent.gifSizes = [
  1,
  720 / FrameComponent.height,
  540 / FrameComponent.height,
  360 / FrameComponent.height
];


export default ExportComponent;
