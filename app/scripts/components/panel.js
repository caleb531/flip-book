class PanelComponent {

  view({attrs: {id}, children}) {
    return m('div.panel', {
      class: PanelComponent.currentlyOpenPanel === id ? 'panel-open' : ''
    }, children);
  }

}
PanelComponent.currentlyOpenPanel = null;

export default PanelComponent;
