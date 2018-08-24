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

  view({attrs: {id, title, icon = null, label = null, action = null, panel = null}}) {
    return m('div.control', {class: `control-${id}`}, [
      panel ? m(PanelComponent, {id}, panel) : null,
      m('button.control-button', {
        title,
        onclick: panel ? () => this.togglePanel(id) : action
      }, [
        icon ? m('img.control-icon', {src: `icons/${icon}.svg`, alt: title}) : null,
        label ? m('span.control-label', label) : null
      ])
    ]);
  }

}

export default ControlComponent;
