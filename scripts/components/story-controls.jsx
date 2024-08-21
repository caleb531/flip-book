import m from 'mithril';
import ControlComponent from './control.jsx';
import SettingsComponent from './settings.jsx';
import ExportComponent from './export.jsx';
import TimelineComponent from './timeline.jsx';

class StoryControlsComponent {
  async skipToFirstFrame(story) {
    story.selectFrame(0);
    await story.save();
  }

  playStory(story) {
    story.play(() => m.redraw());
  }

  async pauseStory(story) {
    story.pause();
    await story.save();
  }

  async addNewFrame(story) {
    story.addNewFrame();
    await story.save();
  }

  async duplicateCurrentFrame(story) {
    story.duplicateCurrentFrame();
    await story.save();
  }

  deleteSelectedFrame(story) {
    // Prevent the synchronous confirm() call from blocking the main thread;
    // this will allow Mithril to redraw and close all panels before showing the
    // modal
    setTimeout(async () => {
      if (!confirm('Are you sure you want to delete this frame? This cannot be undone.')) {
        return;
      }
      story.deleteSelectedFrame();
      await story.save();
      m.redraw();
    });
  }

  async undo(story) {
    story.undo();
    await story.save();
  }

  async redo(story) {
    story.redo();
    await story.save();
  }

  view({ attrs: { story } }) {
    return (
      <div className="story-controls">
        <div className="control-group">
          <ControlComponent
            id="settings"
            title="Settings"
            icon="settings"
            panel={<SettingsComponent story={story} />}
          />
          <ControlComponent
            id="export"
            title="Export"
            icon="save"
            panel={<ExportComponent story={story} />}
          />
        </div>
        <div className="control-group">
          <ControlComponent
            id="skip-to-first-frame"
            title="Skip to First Frame"
            icon="skip-previous"
            action={() => this.skipToFirstFrame(story)}
          />
          <ControlComponent
            id="play-story"
            title="Play Story"
            icon="play"
            action={() => this.playStory(story)}
          />
          <ControlComponent
            id="pause-story"
            title="Pause Story"
            icon="pause"
            action={() => this.pauseStory(story)}
          />
        </div>
        <div className="control-group timeline-control-group">
          <div className="control-group">
            <ControlComponent
              id="add-frame"
              title="Add Frame"
              icon="add"
              action={() => this.addNewFrame(story)}
            />
            <ControlComponent
              id="duplicate-frame"
              title="Duplicate Current Frame"
              icon="duplicate"
              action={() => this.duplicateCurrentFrame(story)}
            />
            <ControlComponent
              id="delete-frame"
              title="Delete Frame"
              icon="remove"
              action={() => this.deleteSelectedFrame(story)}
            />
          </div>
          <TimelineComponent story={story} />
        </div>
        <div className="control-group">
          <ControlComponent
            id="undo-stroke"
            title="Undo Stroke"
            icon="undo"
            action={() => this.undo(story)}
          />
          <ControlComponent
            id="redo-stroke"
            title="Redo Stroke"
            icon="redo"
            action={() => this.redo(story)}
          />
        </div>
      </div>
    );
  }
}

export default StoryControlsComponent;
