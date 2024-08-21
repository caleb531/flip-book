import clsx from 'clsx';

class ProgressBarComponent {
  view({ attrs: { progress = 0 } }) {
    return (
      <div className="progress-bar">
        <div
          className={clsx('progress-bar-current-progress', {
            'no-progress': progress === 0
          })}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    );
  }
}
ProgressBarComponent.delay = 500;

export default ProgressBarComponent;
