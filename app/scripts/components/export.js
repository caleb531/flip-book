import FrameComponent from './frame.js';
import ControlComponent from './control.js';
import GifExportComponent from './gif-export.js';

class ExportComponent {

  exportStory(story) {
    story.export({
      width: FrameComponent.width,
      height: FrameComponent.height,
      success: () => m.redraw(),
      progress: () => m.redraw()
    });
  }

  view({attrs: {story}}) {
    return m('div.export-options', [
      m('h2', 'Export'),
      m(ControlComponent, {
        id: 'export-as-gif',
        title: 'Export as GIF',
        label: 'Export as GIF',
        action: () => this.exportStory(story)
      }),
      m(GifExportComponent, {story})
    ]);
  }

}

export default ExportComponent;
