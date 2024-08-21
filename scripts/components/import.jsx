import m from 'mithril';
import Story from '../models/story.js';
import ControlComponent from './control.jsx';
import PanelComponent from './panel.jsx';
import ProgressBarComponent from './progress-bar.jsx';

class ImportComponent {
  oninit({ attrs: { app } }) {
    this.app = app;
    this.chosenFile = null;
    this.uploadProgress = null;
  }

  // Clear details of last upload when panel is closed
  onremove() {
    this.chosenFile = null;
    this.uploadProgress = null;
  }

  setChosenFile(chosenFile) {
    this.chosenFile = chosenFile;
    this.storyAdded = null;
    this.uploadProgress = null;
  }

  uploadChosenFile() {
    let reader = new FileReader();
    reader.onprogress = (event) => {
      this.uploadProgress = event.loaded / event.total;
      m.redraw();
    };
    reader.onload = (event) => {
      setTimeout(async () => {
        let story = new Story(JSON.parse(event.target.result));
        await this.app.addExistingStory(story);
        this.storyAdded = story;
        m.redraw();
        // Show success message for a brief moment, then close panel to take
        // user back to editor
        setTimeout(() => {
          PanelComponent.closeAllPanels();
          m.redraw();
        }, ProgressBarComponent.delay * 2);
      }, ProgressBarComponent.delay);
    };
    this.uploadProgress = 0;
    reader.readAsText(this.chosenFile);
  }

  view() {
    return (
      <div className="import-options">
        <h2>Import Story</h2>
        <div className="import-control-wrapper">
          <input
            type="file"
            accept=".flipbook"
            className="import-file-input"
            onchange={({ target }) => this.setChosenFile(target.files[0])}
          />
          <ControlComponent id="choose-file" title="Choose File" label="Choose File..." />
          <div className="import-chosen-file-name">
            {this.chosenFile ? this.chosenFile.name : 'No file chosen'}
          </div>
        </div>
        <div className="import-footer">
          {this.storyAdded ? (
            <div className="import-success-message">
              "{this.storyAdded.metadata.name}" successfully added!
            </div>
          ) : (
            [
              this.uploadProgress === null ? (
                this.chosenFile ? (
                  <ControlComponent
                    id="upload-file"
                    title="Upload Now"
                    label="Upload Now"
                    action={() => this.uploadChosenFile()}
                  />
                ) : null
              ) : (
                <ProgressBarComponent progress={this.uploadProgress} />
              )
            ]
          )}
        </div>
      </div>
    );
  }
}

export default ImportComponent;
