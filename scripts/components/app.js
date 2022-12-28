import m from 'mithril';
import App from '../models/app.js';
import UpdateNotificationComponent from './update-notification.js';
import AppHeaderComponent from './app-header.js';
import StoryComponent from './story.js';

class AppComponent {

  oninit() {
    this.app = App.restore();
  }

  oncreate({dom}) {
    dom.focus();
  }

  navigateFramesViaKeyboard(event) {
    let story = this.app.selectedStory;
    if (event.key === 'ArrowLeft' && !story.playing) {
      story.selectPreviousFrame();
      story.save();
    } else if (event.key === 'ArrowRight' && !story.playing) {
      story.selectNextFrame();
      story.save();
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

      m(AppHeaderComponent),

      m(StoryComponent, {
        app: this.app,
        story: this.app.selectedStory
      })

    ]);
  }

}

export default AppComponent;
