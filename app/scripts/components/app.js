import App from '../models/app.js';
import UpdateNotificationComponent from './update-notification.js';
import AppHeaderComponent from './app-header.js';
import StoryComponent from './story.js';

class AppComponent {

  oninit() {
    this.app = App.restore();
    if (navigator.serviceWorker) {
      let serviceWorker = navigator.serviceWorker.register('service-worker.js');
      this.updateManager = new ServiceWorkerUpdateManager(serviceWorker);
      this.updateManager.on('updateAvailable', () => m.redraw());
    }
  }

  view() {
    return m('div.app', [

      this.updateManager ? m(UpdateNotificationComponent, {
        updateManager: this.updateManager
      }) : null,

      m(AppHeaderComponent),

      m(StoryComponent, {
        app: this.app,
        story: this.app.selectedStory
      })

    ]);
  }

}

export default AppComponent;
