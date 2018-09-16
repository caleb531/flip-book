import classNames from '../classnames.js';
import ControlComponent from './control.js';
import ProgressBarComponent from './progress-bar.js';

class ExportGifComponent {

  view({attrs: {isExportingGif, exportProgress, isGifExportFinished, exportedImageUrl, abort}}) {
    return m('div.export-gif-screen', {
      class: classNames({'visible': isExportingGif || isGifExportFinished})
    }, [
      m(ControlComponent, {
        id: 'close-export-gif-overlay',
        title: 'Close Overlay',
        icon: 'close'
      }),
      m('div.export-gif-overlay', {onclick: () => abort()}),
      m('div.export-gif-heading', exportedImageUrl ?
        'GIF Generated!' :
        'Generating GIF...'),
      m('p.export-gif-message', exportedImageUrl ?
        'Right-click the image and choose "Save Image As..." to download.' :
        ''),
      exportedImageUrl ? m('img.exported-image', {
        src: exportedImageUrl,
        alt: 'Exported GIF'
      }) : m(ProgressBarComponent, {
        progress: exportProgress
      })
    ]);
  }

}

export default ExportGifComponent;
