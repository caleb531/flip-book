import App from '../models/app.js';
import StoryEditorComponent from './story-editor.js';

class AppComponent {

  oninit() {
    this.app = App.restore();
  }

  view() {
    return m('div.app', [

      m(StoryEditorComponent, {
        story: this.app.selectedStory,
        save: () => {
          this.app.saveStory(this.app.getSelectedStoryId(), this.app.selectedStory);
        }
      })

    ]);
  }

}

export default AppComponent;
