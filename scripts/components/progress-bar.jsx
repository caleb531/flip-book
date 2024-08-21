import m from 'mithril';
import clsx from 'clsx';

class ProgressBarComponent {

  view({attrs: {progress = 0}}) {
    return m('div.progress-bar', [
      m('div.progress-bar-current-progress', {
        class: clsx({'no-progress': progress === 0}),
        style: {width: `${progress * 100}%`}
      })
    ]);
  }

}
ProgressBarComponent.delay = 500;

export default ProgressBarComponent;
