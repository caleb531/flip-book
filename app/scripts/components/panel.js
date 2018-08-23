class PanelComponent {

  view({attrs: {open}, children}) {
    return m('div.panel', {
      class: open ? 'panel-open' : ''
    }, children);
  }

}

export default PanelComponent;
