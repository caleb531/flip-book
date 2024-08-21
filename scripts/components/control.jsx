import m from 'mithril';
import clsx from 'clsx';
import PanelComponent from './panel.jsx';

class ControlComponent {

  view({attrs: {id, title, icon = null, label = null, action = null, panel = null, panelPosition = 'top'}}) {
    return m(`div`, {
      class: clsx('control', `control-${id}`, {'control-has-label': label})
    }, [
      panel ? m(PanelComponent, {id, position: panelPosition}, panel) : null,
      m('button.control-button', {
        title,
        onclick: ({target}) => {
          if (panel) {
            PanelComponent.togglePanel(id);
          } else if (action) {
            // Do not close the panel where the clicked control resides
            if (!target.closest('.panel')) {
              PanelComponent.closeAllPanels();
            }
            action();
          }
        }
      }, [
        icon ? m('img.control-icon', {src: `icons/${icon}.svg`, alt: title}) : null,
        label ? m('span.control-label', label) : null
      ])
    ]);
  }

}

export default ControlComponent;
