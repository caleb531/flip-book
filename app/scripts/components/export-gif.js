import classNames from '../classnames.js';
import ControlComponent from './control.js';
import ProgressBarComponent from './progress-bar.js';

class ExportGifComponent {

  view({attrs: {story}}) {
    return m('div.export-gif-screen', {
      class: classNames({'visible': story.isExportingGif() || story.isGifExportFinished()})
    }, [
      m(ControlComponent, {
        id: 'close-export-gif-overlay',
        title: 'Close Overlay',
        icon: 'close'
      }),
      m('div.export-gif-overlay', {onclick: () => story.abortGifExport()}),
      m('div.export-gif-heading', story.exportedImageUrl ?
        'GIF Generated!' :
        'Generating GIF...'),
      m('p.export-gif-message', story.exportedImageUrl ?
        'Right-click the image and choose "Save Image As..." to download.' :
        ''),
      !story.exportedImageUrl ? m(ProgressBarComponent, {
        progress: story.exportProgress
      }) : null,
      story.exportedImageUrl ? m('img.exported-image', {
        src: story.exportedImageUrl,
        alt: 'Exported GIF'
      }) : null
    ]);
  }

}

export default ExportGifComponent;
