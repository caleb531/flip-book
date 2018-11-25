import App from '../models/app.js';
import UpdateNotificationComponent from './update-notification.js';
import AppHeaderComponent from './app-header.js';
import StoryComponent from './story.js';

class AppComponent {

  oninit() {
    this.app = App.restore();
    if (navigator.serviceWorker && !window.__karma__ && window.location.port !== '8080') {
      let serviceWorker = navigator.serviceWorker.register('service-worker.js');
      this.updateManager = new SWUpdateManager(serviceWorker);
      this.updateManager.on('updateAvailable', () => m.redraw());
      this.updateManager.checkForUpdates();
    }
  }

  oncreate({dom}) {
    FastClick.attach(dom);
    dom.focus();
  }

  onupdate({dom}) {
    dom.focus();
  }

  navigateFramesViaKeyboard(event) {
    let story = this.app.selectedStory;
    if (event.key === 'ArrowLeft') {
      story.selectPreviousFrame();
      story.save();
    } else if (event.key === 'ArrowRight') {
      story.selectNextFrame();
      story.save();
    } else if (event.key === ' ') {
      if (story.playing) {
        story.pause();
      } else {
        story.play(() => m.redraw());
      }
    } else {
      event.redraw = false;
    }
  }

  view() {
    return m('div.app[tabindex=-1]', {
      onkeydown: (event) => this.navigateFramesViaKeyboard(event)
    }, [

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
