class SettingsComponent {

  toggleShowPreviousFrame(story, save) {
    story.showPreviousFrame = !story.showPreviousFrame;
    save();
  }

  view({attrs: {story, save}}) {
    return m('div.settings', [
      m('h2', 'Settings'),
      m('div.setting', [
        m('input[type=checkbox]#setting-show-previous-frame', {
          checked: story.showPreviousFrame,
          onchange: () => this.toggleShowPreviousFrame(story, save)
        }),
        m('label[for="setting-show-previous-frame"]', 'Show Previous Frame?'),
      ])
    ]);
  }

}

export default SettingsComponent;
