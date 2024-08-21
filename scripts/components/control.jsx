import clsx from 'clsx';
import PanelComponent from './panel.jsx';

class ControlComponent {
  view({
    attrs: {
      id,
      title,
      icon = null,
      label = null,
      action = null,
      panel = null,
      panelPosition = 'top'
    }
  }) {
    return (
      <div
        className={clsx('control', `control-${id}`, {
          'control-has-label': label
        })}
      >
        {panel ? (
          <PanelComponent id={id} position={panelPosition}>
            {panel}
          </PanelComponent>
        ) : null}
        <button
          className="control-button"
          title={title}
          onclick={({ target }) => {
            if (panel) {
              PanelComponent.togglePanel(id);
            } else if (action) {
              // Do not close the panel where the clicked control resides
              if (!target.closest('.panel')) {
                PanelComponent.closeAllPanels();
              }
              action();
            }
          }}
        >
          {icon ? <img className="control-icon" src={`icons/${icon}.svg`} alt={title} /> : null}
          {label ? <span className="control-label">{label}</span> : null}
        </button>
      </div>
    );
  }
}

export default ControlComponent;
