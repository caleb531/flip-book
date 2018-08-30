import Story from '../models/story.js';
import ControlComponent from './control.js';
import ProgressBarComponent from './progress-bar.js';

class ImportComponent {

  setChosenFile(chosenFile) {
    this.chosenFile = chosenFile;
    this.storyAdded = null;
    this.uploadProgress = null;
  }

  uploadChosenFile(app) {
    let reader = new FileReader();
    reader.onprogress = (event) => {
      this.uploadProgress = event.loaded / event.total;
      m.redraw();
    };
    reader.onload = (event) => {
      setTimeout(() => {
        let story = new Story(JSON.parse(event.target.result));
        app.addExistingStory(story);
        this.storyAdded = story;
        m.redraw();
      }, ProgressBarComponent.delay);
    };
    this.uploadProgress = 0;
    reader.readAsText(this.chosenFile);
  }

  view({attrs: {app}}) {
    return m('div.import-options', [
      m('h2', 'Import Story'),
      m('div.import-control-wrapper', [
        m('input[type=file][accept=.flipbook].import-file-input', {
          onchange: ({target}) => this.setChosenFile(target.files[0])
        }),
        m(ControlComponent, {
          id: 'choose-file',
          title: 'Choose File',
          label: 'Choose File...'
        }),
        m('div.import-chosen-file-name', this.chosenFile ? this.chosenFile.name : 'No file chosen')
      ]),
      m('div.import-footer', [
        this.storyAdded ? m('div.import-success-message', `"${this.storyAdded.metadata.name}" successfully added!`) :
        [
          this.uploadProgress >= 0 ? m(ProgressBarComponent, {
            progress: this.uploadProgress
          }) : null,
          this.chosenFile ? m(ControlComponent, {
            id: 'upload-file',
            title: 'Upload Now',
            label: 'Upload Now',
            action: () => this.uploadChosenFile(app)
          }) : null
        ]
      ])
    ]);
  }

}

export default ImportComponent;
