import OverlayComponent from './overlay.jsx';

class ModalComponent {
  view(vnode) {
    return (
      <>
        <OverlayComponent
          type="modal"
          onDismiss={() => {
            /* do nothing */
          }}
        />
        ,
        <div className="modal" {...vnode.attrs}>
          {vnode.children}
        </div>
      </>
    );
  }
}

export default ModalComponent;
