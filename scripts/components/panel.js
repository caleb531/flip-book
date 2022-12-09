import m from 'mithril';

class PanelComponent {

  view({attrs: {id, position}, children}) {
    return PanelComponent.panelIsOpen(id) ? [
      m('div.panel-overlay', {onclick: () => PanelComponent.closeAllPanels()}),
      m(`div.panel.panel-${id}.panel-position-${position}`, children)
    ] : null;
  }

}
// Only one panel can be open at a time
PanelComponent.currentlyOpenPanel = null;

PanelComponent.panelIsOpen = (id) => {
  return (PanelComponent.currentlyOpenPanel === id);
};
PanelComponent.panelIsClosed = (id) => {
  return !PanelComponent.panelIsOpen(id);
};
PanelComponent.openPanel = (id) => {
  PanelComponent.currentlyOpenPanel = id;
};
PanelComponent.togglePanel = (id) => {
  if (PanelComponent.panelIsClosed(id)) {
    PanelComponent.openPanel(id);
  } else {
    PanelComponent.closeAllPanels();
  }
};
PanelComponent.closeAllPanels = () => {
  PanelComponent.currentlyOpenPanel = null;
};

export default PanelComponent;
