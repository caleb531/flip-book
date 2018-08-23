import FrameComponent from './frame.js';
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
      m('button.text-control', {
        onclick: () => this.exportStory(story)
      }, 'Export to GIF'),
      m(GifExportComponent, {story})
    ]);
  }

}

export default ExportComponent;
