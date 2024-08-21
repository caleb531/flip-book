class OverlayComponent {
  view({ attrs: { type, onDismiss } }) {
    return <div className={`${type}-overlay`} onclick={() => onDismiss()} />;
  }
}

export default OverlayComponent;
