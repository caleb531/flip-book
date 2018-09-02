import FrameComponent from './frame.js';
import ControlComponent from './control.js';
import ProgressBarComponent from './progress-bar.js';
import ExportGifComponent from './export-gif.js';

class ExportComponent {

  exportStoryToGif(story) {
    story.exportGif({
      width: FrameComponent.width,
      height: FrameComponent.height,
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

  view({attrs: {story}}) {
    return m('div.export-options', [
      m('h2', 'Export'),
      m(ControlComponent, {
        id: 'export-gif',
        title: 'Export GIF',
        label: 'Export GIF',
        action: () => this.exportStoryToGif(story)
      }),
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

export default ExportComponent;
