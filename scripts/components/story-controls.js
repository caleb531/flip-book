import m from 'mithril';
import ControlComponent from './control.js';
import SettingsComponent from './settings.js';
import ExportComponent from './export.js';
import TimelineComponent from './timeline.js';

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

  view({attrs: {story}}) {
    return m('div.story-controls', [

      m('div.control-group', [
        m(ControlComponent, {
          id: 'settings',
          title: 'Settings',
          icon: 'settings',
          panel: m(SettingsComponent, {story})
        }),
        m(ControlComponent, {
          id: 'export',
          title: 'Export',
          icon: 'save',
          panel: m(ExportComponent, {story})
        })
      ]),

      m('div.control-group', [
        m(ControlComponent, {
          id: 'skip-to-first-frame',
          title: 'Skip to First Frame',
          icon: 'skip-previous',
          action: () => this.skipToFirstFrame(story)
        }),
        m(ControlComponent, {
          id: 'play-story',
          title: 'Play Story',
          icon: 'play',
          action: () => this.playStory(story)
        }),
        m(ControlComponent, {
          id: 'pause-story',
          title: 'Pause Story',
          icon: 'pause',
          action: () => this.pauseStory(story)
        })
      ]),

      m('div.control-group.timeline-control-group', [

        m('div.control-group', [
          m(ControlComponent, {
            id: 'add-frame',
            title: 'Add Frame',
            icon: 'add',
            action: () => this.addNewFrame(story)
          }),
          m(ControlComponent, {
            id: 'duplicate-frame',
            title: 'Duplicate Current Frame',
            icon: 'duplicate',
            action: () => this.duplicateCurrentFrame(story)
          }),
          m(ControlComponent, {
            id: 'delete-frame',
            title: 'Delete Frame',
            icon: 'remove',
            action: () => this.deleteSelectedFrame(story)
          })
        ]),

        m(TimelineComponent, {story})

      ]),

      m('div.control-group', [
        m(ControlComponent, {
          id: 'undo-stroke',
          title: 'Undo Stroke',
          icon: 'undo',
          action: () => this.undo(story)
        }),
        m(ControlComponent, {
          id: 'redo-stroke',
          title: 'Redo Stroke',
          icon: 'redo',
          action: () => this.redo(story)
        })
      ])

    ]);
  }

}

export default StoryControlsComponent;
