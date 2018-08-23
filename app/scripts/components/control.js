import PanelComponent from './panel.js';

class ControlComponent {

  oninit() {
    this.panelOpen = false;
  }

  togglePanel() {
    this.panelOpen = !this.panelOpen;
  }

  view({attrs: {id, title, icon, action = null, panel = null}}) {
    return m('div.control', {class: `control-${id}`, title}, [
      panel ? m(PanelComponent, {open: this.panelOpen}, panel) : null,
      m('button', {
        onclick: panel ? () => this.togglePanel(panel) : action
      }, m('img', {src: `icons/${icon}.svg`, alt: title}))
    ]);
  }

}

export default ControlComponent;
