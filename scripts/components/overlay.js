import m from 'mithril';

class OverlayComponent {
  view({ attrs: { onDismiss } }) {
    return m('div.overlay', { onclick: () => onDismiss() });
  }
}

export default OverlayComponent;
