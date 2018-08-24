import ControlComponent from './control.js';
import SettingsComponent from './settings.js';
import ExportComponent from './export.js';
import TimelineComponent from './timeline.js';

class StoryControlsComponent {

  skipToFirstFrame(story) {
    story.selectFrame(0);
    story.save();
  }

  playStory(story) {
    story.play(() => m.redraw());
  }

  pauseStory(story) {
    story.pause();
    story.save();
  }

  selectPreviousFrame(story) {
    story.selectPreviousFrame();
    story.save();
  }

  selectNextFrame(story) {
    story.selectNextFrame();
    story.save();
  }

  addFrame(story) {
    story.addFrame();
    story.save();
  }

  removeSelectedFrame(story) {
    if (!confirm('Are you sure you want to delete this frame?')) {
      return;
    }
    story.removeSelectedFrame();
    story.save();
  }

  undo(story) {
    story.undo();
    story.save();
  }

  redo(story) {
    story.redo();
    story.save();
  }

  view({attrs: {story}}) {
    return m('div.story-controls.controls', [

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

      m('div.control-group', [
        m(ControlComponent, {
          id: 'previous-frame',
          title: 'Previous Frame',
          icon: 'arrow-back',
          action: () => this.selectPreviousFrame(story)
        }),
        m(ControlComponent, {
          id: 'next-frame',
          title: 'Next Frame',
          icon: 'arrow-forward',
          action: () => this.selectNextFrame(story)
        }),
      ]),

      m('div.control-group', [
        m(ControlComponent, {
          id: 'add-frame',
          title: 'Add Frame',
          icon: 'add',
          action: () => this.addFrame(story)
        }),
        m(ControlComponent, {
          id: 'remove-frame',
          title: 'Remove Frame',
          icon: 'remove',
          action: () => this.removeSelectedFrame(story)
        }),
      ]),

      m(TimelineComponent, {story}),

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
        }),
      ])

    ]);
  }

}

export default StoryControlsComponent;
