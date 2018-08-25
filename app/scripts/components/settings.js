class SettingsComponent {

  setFrameDuration(story, framesPerSecond) {
    story.setFrameDurationFromFPS(Number(framesPerSecond));
  }

  toggleShowPreviousFrame(story) {
    story.showPreviousFrame = !story.showPreviousFrame;
    story.save();
  }

  view({attrs: {story}}) {
    return m('div.settings', [
      m('h2', 'Settings'),
      m('div.setting', [
        m('label[for="setting-fps"]', 'FPS'),
        m('input[type=range][step=5][min=5][max=30]#setting-fps', {
          value: story.getFPS(),
          // Update the story frame duration while dragging slider
          oninput: ({target}) => this.setFrameDuration(story, target.value),
          // Only save when the user lets go of dragging slider
          onchange: () => story.save()
        }),
        m('span.setting-value', `${story.getFPS()} fps`)
      ]),
      m('div.setting', [
        m('input[type=checkbox]#setting-show-previous-frame', {
          checked: story.showPreviousFrame,
          onchange: () => this.toggleShowPreviousFrame(story)
        }),
        m('label[for="setting-show-previous-frame"]', 'Show Previous Frame?'),
      ])
    ]);
  }

}

export default SettingsComponent;
