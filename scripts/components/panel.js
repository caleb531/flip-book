import m from 'mithril';
import OverlayComponent from './overlay';

class PanelComponent {

  view({attrs: {id, position, dismissable = true}, children}) {
    return PanelComponent.panelIsOpen(id) ? [
      m(OverlayComponent, {
        type: 'panel',
        onDismiss: () => {
          if (dismissable) {
            PanelComponent.closeAllPanels();
          }
        }
      }),
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
