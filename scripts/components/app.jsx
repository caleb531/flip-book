import m from 'mithril';
import App from '../models/app.js';
import UpdateNotificationComponent from './update-notification.jsx';
import AppHeaderComponent from './app-header.jsx';
import StoryComponent from './story.jsx';
import StorageUpgraderComponent from './storage-upgrader.jsx';

class AppComponent {

  oninit() {
    App.restore().then((app) => {
      this.app = app;
      m.redraw();
    });
  }

  oncreate({dom}) {
    dom.focus();
  }

  async navigateFramesViaKeyboard(event) {
    let story = await this.app.selectedStory;
    if (event.key === 'ArrowLeft' && !story.playing) {
      story.selectPreviousFrame();
      await story.save();
    } else if (event.key === 'ArrowRight' && !story.playing) {
      story.selectNextFrame();
      await story.save();
    } else if (event.key === ' ') {
      event.preventDefault();
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

      // The UpdateNotificationComponent manages its own visibility
      m(UpdateNotificationComponent),

      m(StorageUpgraderComponent),

      m(AppHeaderComponent),

      this.app?.selectedStory ? m(StoryComponent, {
        app: this.app,
        story: this.app.selectedStory
      }) : null

    ]);
  }

}

export default AppComponent;
