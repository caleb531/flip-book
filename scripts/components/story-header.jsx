import m from 'mithril';
import ControlComponent from './control.jsx';
import PanelComponent from './panel.jsx';
import StoryListComponent from './story-list.jsx';
import ImportComponent from './import.jsx';

class StoryHeaderComponent {
  oninit({ attrs: { app } }) {
    this.app = app;
  }

  createNewStoryWithName() {
    // Prevent the synchronous prompt() call from blocking the main thread; this
    // will allow Mithril to redraw and close all panels before showing the
    // modal
    setTimeout(async () => {
      let storyName = prompt('Please enter a name for your new story:') || '';
      if (storyName.trim()) {
        await this.app.createNewStoryWithName(storyName.trim());
        PanelComponent.closeAllPanels();
        m.redraw();
      }
    });
  }

  renameSelectedStory() {
    // Prevent the synchronous confirm() call from blocking the main thread;
    // this will allow Mithril to redraw and close all panels before showing the
    // modal
    setTimeout(async () => {
      let newStoryName =
        prompt('Enter the new name for your story:', await this.app.getSelectedStoryName()) || '';
      if (newStoryName.trim()) {
        await this.app.renameSelectedStory(newStoryName.trim());
        m.redraw();
      }
    });
  }

  deleteSelectedStory() {
    // Prevent the synchronous confirm() call from blocking the main thread;
    // this will allow Mithril to redraw and close all panels before showing the
    // modal
    setTimeout(() => {
      if (confirm('Are you sure you want to delete this story? This cannot be undone.')) {
        this.app.deleteSelectedStory();
        m.redraw();
      }
    });
  }

  view({ attrs: { story } }) {
    return (
      <div className="story-header">
        <div className="control-group">
          <ControlComponent
            id="create-new-story"
            title="Create New Story"
            icon="add"
            action={() => this.createNewStoryWithName()}
          />
          <ControlComponent
            id="open-story"
            title="Open Story"
            icon="folder"
            panel={<StoryListComponent app={this.app} />}
            panelPosition="bottom"
          />
          <ControlComponent
            id="import-story"
            title="Import Story"
            icon="upload"
            panel={<ImportComponent app={this.app} />}
            panelPosition="bottom"
          />
        </div>
        <span className="selected-story-name">{story.metadata.name}</span>
        <ControlComponent
          id="rename-story"
          title="Rename Story"
          icon="edit"
          action={() => this.renameSelectedStory()}
        />
        <div className="control-group">
          <ControlComponent
            id="delete-story"
            title="Delete Story"
            icon="delete"
            action={() => this.deleteSelectedStory()}
          />
          <ControlComponent
            id="help"
            title="Help"
            icon="help"
            action={() => {
              window.open('https://github.com/caleb531/flip-book#how-to-use');
            }}
          />
        </div>
      </div>
    );
  }
}

export default StoryHeaderComponent;
