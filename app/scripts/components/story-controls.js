import ControlComponent from './control.js';
import TimelineComponent from './timeline.js';

class StoryControlsComponent {

  oninit({attrs: {save}}) {
    this.save = save;
  }

  skipToFirstFrame(story) {
    story.setSelectedFrame(0);
    this.save();
  }

  playStory(story) {
    story.play(() => m.redraw());
  }

  pauseStory(story) {
    story.pause();
    this.save();
  }

  selectPreviousFrame(story) {
    story.selectPreviousFrame();
    this.save();
  }

  selectNextFrame(story) {
    story.selectNextFrame();
    this.save();
  }

  addFrame(story) {
    story.addFrame();
    this.save();
  }

  removeSelectedFrame(story) {
    story.removeSelectedFrame();
    this.save();
  }

  undo(story) {
    story.undo();
    this.save();
  }

  redo(story) {
    story.redo();
    this.save();
  }

  view({attrs: {story}}) {
    return m('div.story-controls.controls', [

      m('div.control-group', [
        m(ControlComponent, {
          id: 'settings',
          title: 'Settings',
          icon: 'settings',
          action: () => this.toggleSettings()
        }),
        m(ControlComponent, {
          id: 'export',
          title: 'Export to GIF',
          icon: 'save',
          action: () => this.exportStory(story)
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
