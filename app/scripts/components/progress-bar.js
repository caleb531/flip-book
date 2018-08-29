import classNames from '../classnames.js';

class ProgressBarComponent {

  view({attrs: {progress = 0}}) {
    return m('div.progress-bar', [
      m('div.progress-bar-current-progress', {
        class: classNames({'no-progress': progress === 0}),
        style: {width: `${progress * 100}%`}
      })
    ]);
  }

}
ProgressBarComponent.delay = 500;

export default ProgressBarComponent;
