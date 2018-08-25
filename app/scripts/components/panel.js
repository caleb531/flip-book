class PanelComponent {

  view({attrs: {id, position}, children}) {
    return m('div.panel', {
      class: [
        PanelComponent.currentlyOpenPanel === id ? 'panel-open' : '',
        position ? `panel-position-${position}` : ''
      ].join(' ')
    }, children);
  }

}
PanelComponent.currentlyOpenPanel = null;

export default PanelComponent;
