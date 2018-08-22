class ExportComponent {

  abortExport(story) {
    story.abortExport();
  }

  view({attrs: {story}}) {
    return m('div.export-screen', {
      class: story.isExporting() || story.exportIsFinished() ? 'visible' : ''
    }, [
      m('div.export-overlay', {onclick: () => this.abortExport(story)}),
      m('div.export-heading', story.exportedImageUrl ?
        'GIF Generated!' :
        'Generating GIF...'),
      m('p.export-message', story.exportedImageUrl ?
        'Right-click the image and choose "Save Image As..." to download.' :
        ''),
      m('div.export-loading-icon', {
        class: !story.exportedImageUrl ? 'visible' : ''
      }, m('svg[viewBox="0 0 24 24"]', [
        m('path', {d: 'M 3,12 A 6,6 0,0,0 21,12'})
      ])),
      story.exportedImageUrl ? m('img.exported-image', {
        src: story.exportedImageUrl,
        alt: 'Exported GIF'
      }) : null
    ]);
  }

}

export default ExportComponent;
