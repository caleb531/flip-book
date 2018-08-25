import App from '../models/app.js';
import AppHeaderComponent from './app-header.js';
import StoryComponent from './story.js';

class AppComponent {

  oninit() {
    this.app = App.restore();
  }

  view() {
    return m('div.app', [

      m(AppHeaderComponent),

      m(StoryComponent, {
        app: this.app,
        story: this.app.selectedStory
      })

    ]);
  }

}

export default AppComponent;
