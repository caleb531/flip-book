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
      !story.exportedImageUrl ? m('div.export-progress-bar', [
        m('div.export-progress-bar-current-progress', {
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

export default ExportComponent;
