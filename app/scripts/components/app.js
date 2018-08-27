import App from '../models/app.js';
import UpdateManager from '../models/update-manager.js';
import UpdateNotificationComponent from './update-notification.js';
import AppHeaderComponent from './app-header.js';
import StoryComponent from './story.js';

class AppComponent {

  oninit() {
    this.app = App.restore();
    this.updateManager = new UpdateManager({
      workerURL: 'service-worker.js',
      updateAvailable: () => m.redraw()
    });
  }

  view() {
    return m('div.app', [

      m(UpdateNotificationComponent, {
        updateManager: this.updateManager
      }),

      m(AppHeaderComponent),

      m(StoryComponent, {
        app: this.app,
        story: this.app.selectedStory
      })

    ]);
  }

}

export default AppComponent;
