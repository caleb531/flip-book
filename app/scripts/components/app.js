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
        onSave: (story) => {
          this.app.saveStory(this.app.getSelectedStoryId(), story);
        }
      })

    ]);
  }

}

export default AppComponent;
