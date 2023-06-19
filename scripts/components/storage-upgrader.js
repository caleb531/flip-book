import m from 'mithril';
import DismissableOverlayComponent from './overlay.js';
import LoadingComponent from './loading.js';
import StorageUpgrader from '../models/storage-upgrader.js';
import ModalComponent from './modal.js';
import _ from 'underscore';

class StorageUpgraderComponent {
  oninit() {
    this.upgrader = new StorageUpgrader();
    if (true || this.upgrader.shouldUpgrade()) {
      this.isVisible = true;
      this.upgrade();
    }
  }

  upgrade() {
    console.log('upgrade() called; dry-run');
    return;
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
    return this.isVisible
      ? m(
          'div.storage-upgrader',
          {
            oncreate: this.blurEditor
          },
          [

            m(ModalComponent, [
              m('h2.storage-upgrader-heading', 'Upgrading Database...'),

              m(
                'p.storage-upgrader-message',
                'Hang tight while we upgrade the database...'
              ),

              m(LoadingComponent, { class: 'storage-upgrader-loading' })
            ])
          ]
        )
      : null;
  }
}

export default StorageUpgraderComponent;
