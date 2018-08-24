import App from '../models/app.js';
import AppHeaderComponent from './app-header.js';
import StoryEditorComponent from './story-editor.js';

class AppComponent {

  oninit() {
    this.app = App.restore();
  }

  view() {
    return m('div.app', [

      m(AppHeaderComponent),

      m(StoryEditorComponent, {
        story: this.app.selectedStory,
        save: () => this.app.selectedStory.save()
      })

    ]);
  }

}

export default AppComponent;
