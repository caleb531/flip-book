import PanelComponent from './panel.js';

class ControlComponent {

  togglePanel(id) {
    // Only one panel can be open at a time
    if (PanelComponent.currentlyOpenPanel !== id) {
      PanelComponent.currentlyOpenPanel = id;
    } else {
      PanelComponent.currentlyOpenPanel = null;
    }
  }

  view({attrs: {id, title, icon, action = null, panel = null}}) {
    return m('div.control', {class: `control-${id}`, title}, [
      panel ? m(PanelComponent, {id}, panel) : null,
      m('button.control-button', {
        onclick: panel ? () => this.togglePanel(id) : action
      }, m('img.control-icon', {src: `icons/${icon}.svg`, alt: title}))
    ]);
  }

}

export default ControlComponent;
