import ControlComponent from './control.js';

class StoryControlsComponent {

  oninit({attrs: {story}}) {
    this.story = story;
  }

  skipToFirstFrame() {
    this.story.setSelectedFrame(0);
  }

  playStory() {
    this.story.play(() => m.redraw());
  }

  pauseStory() {
    this.story.pause();
  }

  selectPreviousFrame() {
    this.story.selectPreviousFrame();
  }

  selectNextFrame() {
    this.story.selectNextFrame();
  }

  addFrame() {
    this.story.addFrame();
  }

  removeSelectedFrame() {
    this.story.removeSelectedFrame();
  }

  view() {
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
          action: () => this.exportStory()
        })
      ]),

      m('div.control-group', [
        m(ControlComponent, {
          id: 'skip-to-first-frame',
          title: 'Skip to First Frame',
          icon: 'skip-previous',
          action: () => this.skipToFirstFrame()
        }),
        m(ControlComponent, {
          id: 'play-story',
          title: 'Play Story',
          icon: 'play',
          action: () => this.playStory()
        }),
        m(ControlComponent, {
          id: 'pause-story',
          title: 'Pause Story',
          icon: 'pause',
          action: () => this.pauseStory()
        })
      ]),

      m('div.control-group', [
        m(ControlComponent, {
          id: 'previous-frame',
          title: 'Previous Frame',
          icon: 'arrow-back',
          action: () => this.selectPreviousFrame()
        }),
        m(ControlComponent, {
          id: 'next-frame',
          title: 'Next Frame',
          icon: 'arrow-forward',
          action: () => this.selectNextFrame()
        }),
      ]),

      m('div.control-group', [
        m(ControlComponent, {
          id: 'add-frame',
          title: 'Add Frame',
          icon: 'add',
          action: () => this.addFrame()
        }),
        m(ControlComponent, {
          id: 'remove-frame',
          title: 'Remove Frame',
          icon: 'remove',
          action: () => this.removeSelectedFrame()
        }),
      ]),

      m('div.control-group', [
        m(ControlComponent, {
          id: 'undo-stroke',
          title: 'Undo Stroke',
          icon: 'undo',
          action: () => this.undoStroke()
        }),
        m(ControlComponent, {
          id: 'redo-stroke',
          title: 'Redo Stroke',
          icon: 'redo',
          action: () => this.redoStroke()
        }),
      ])

    ]);
  }

}

export default StoryControlsComponent;
