import m from 'mithril';
import classNames from '../classnames.js';
import PanelComponent from './panel.js';

class ControlComponent {

  view({attrs: {id, title, icon = null, label = null, action = null, panel = null, panelPosition = 'top'}}) {
    return m(`div.control.control-${id}`, {
      class: classNames({'control-has-label': label})
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
