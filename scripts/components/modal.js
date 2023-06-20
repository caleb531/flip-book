import m from 'mithril';
import OverlayComponent from './overlay.js';

class ModalComponent {

  view(vnode) {
    return [
      m(OverlayComponent, {
        type: 'modal',
        onDismiss: () => {
          /* do nothing */
        }
      }),
      m('div.modal', vnode.attrs, vnode.children)
    ];
  }

}

export default ModalComponent;
