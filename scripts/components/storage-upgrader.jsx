import m from 'mithril';
import DismissableOverlayComponent from './overlay.jsx';
import LoadingComponent from './loading.jsx';
import StorageUpgrader from '../models/storage-upgrader.js';
import ModalComponent from './modal.jsx';
import _ from 'underscore';

class StorageUpgraderComponent {
  oninit() {
    this.upgrader = new StorageUpgrader();
    if (this.upgrader.shouldUpgrade()) {
      this.isVisible = true;
      this.upgrade();
    }
  }

  upgrade() {
    // Show the upgrade panel for a minimum of 1000ms so the user has time to
    // perceive what's happening
    setTimeout(() => {
      try {
        this.upgrader.upgrade().catch((error) => {
          this.handleError(error);
        });
      } catch (error) {
        this.handleError(error);
      }
    }, 1000);
  }

  handleError(error) {
    console.error(error);
    this.isVisible = false;
    m.redraw();
  }

  // When the Storage Upgrade prompt shows, blur the editor by focusing the
  // prompt
  blurEditor({ dom }) {
    _.defer(() => {
      dom.focus();
    });
  }

  view() {
    return this.isVisible ? (
      <div className="storage-upgrader" oncreate={this.blurEditor}>
        <ModalComponent>
          <h2 className="storage-upgrader-heading">Upgrading Database...</h2>
          <p className="storage-upgrader-message">Hang tight while we upgrade the database...</p>
          <LoadingComponent class="storage-upgrader-loading" />
        </ModalComponent>
      </div>
    ) : null;
  }
}

export default StorageUpgraderComponent;
