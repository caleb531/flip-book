import FrameComponent from './frame.js';
import ControlComponent from './control.js';
import ExportGifComponent from './export-gif.js';

class ExportComponent {

  exportStoryToGif(story) {
    story.exportGif({
      width: FrameComponent.width,
      height: FrameComponent.height,
      // Aribtrarily wait half a second before loading to give the progress bar
      // time to reach 100%
      success: () => setTimeout(() => m.redraw(), 500),
      progress: () => m.redraw()
    });
  }

  view({attrs: {story}}) {
    return m('div.export-options', [
      m('h2', 'Export'),
      m(ControlComponent, {
        id: 'export-as-gif',
        title: 'Export GIF',
        label: 'Export GIF',
        action: () => this.exportStoryToGif(story)
      }),
      m(ExportGifComponent, {story})
    ]);
  }

}

export default ExportComponent;
