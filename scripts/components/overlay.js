import m from 'mithril';

class OverlayComponent {
  view({ attrs: { type, onDismiss } }) {
    return m(`div.${type}-overlay`, { onclick: () => onDismiss() });
  }
}

export default OverlayComponent;
