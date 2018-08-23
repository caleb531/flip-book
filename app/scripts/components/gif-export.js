class GifExportComponent {

  abortExport(story) {
    story.abortExport();
  }

  view({attrs: {story}}) {
    return m('div.gif-export-screen', {
      class: story.isExporting() || story.exportIsFinished() ? 'visible' : ''
    }, [
      m('div.gif-export-overlay', {onclick: () => this.abortExport(story)}),
      m('div.gif-export-heading', story.exportedImageUrl ?
        'GIF Generated!' :
        'Generating GIF...'),
      m('p.gif-export-message', story.exportedImageUrl ?
        'Right-click the image and choose "Save Image As..." to download.' :
        ''),
      !story.exportedImageUrl ? m('div.gif-export-progress-bar', [
        m('div.gif-export-progress-bar-current-progress', {
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

export default GifExportComponent;
