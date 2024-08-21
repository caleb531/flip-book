import m from 'mithril';
import clsx from 'clsx';
import ControlComponent from './control.jsx';
import ProgressBarComponent from './progress-bar.jsx';

class ExportGifComponent {

  view({attrs: {isExportingGif, exportProgress, isGifExportFinished, exportedImageUrl, abort}}) {
    return m('div', {
      class: clsx('export-gif-screen', {'visible': isExportingGif || isGifExportFinished})
    }, [
      m(ControlComponent, {
        id: 'close-export-gif-overlay',
        title: isGifExportFinished ? 'Close overlay' : 'Abort GIF export',
        icon: 'close',
        action: () => abort()
      }),
      m('div.export-gif-overlay'),
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
