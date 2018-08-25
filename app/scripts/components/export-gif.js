class ExportGifComponent {

  view({attrs: {story}}) {
    return m('div.export-gif-screen', {
      class: story.isExportingGif() || story.isGifExportFinished() ? 'visible' : ''
    }, [
      m('div.export-gif-overlay', {onclick: () => story.abortExport()}),
      m('div.export-gif-heading', story.exportedImageUrl ?
        'GIF Generated!' :
        'Generating GIF...'),
      m('p.export-gif-message', story.exportedImageUrl ?
        'Right-click the image and choose "Save Image As..." to download.' :
        ''),
      !story.exportedImageUrl ? m('div.export-gif-progress-bar', [
        m('div.export-gif-progress-bar-current-progress', {
          class: story.exportProgress === 0 ? 'no-progress' : '',
          style: {width: `${story.exportProgress * 100}%`}
        })
      ]) : null,
      story.exportedImageUrl ? m('img.exported-image', {
        src: story.exportedImageUrl,
        alt: 'Exported GIF'
      }) : null
    ]);
  }

}

export default ExportGifComponent;
