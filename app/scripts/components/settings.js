class SettingsComponent {

  setFrameDuration(story, framesPerSecond) {
    story.setFrameDurationFromFPS(Number(framesPerSecond));
    story.save();
  }

  toggleShowPreviousFrame(story) {
    story.showPreviousFrame = !story.showPreviousFrame;
    story.save();
  }

  setLineWidth(story, lineWidth) {
    story.frameStyles.lineWidth = Number(lineWidth);
    story.save();
  }

  view({attrs: {story}}) {
    return m('div.settings', [
      m('h2', 'Settings'),
      m('div.setting', [
        m('label[for="setting-fps"]', 'FPS'),
        m('input[type=range][min=2][max=30][step=2]#setting-fps', {
          value: story.getFPS(),
          oninput: ({target}) => this.setFrameDuration(story, target.value)
        }),
        m('span.setting-value', story.getFPS())
      ]),
      m('div.setting', [
        m('label[for="setting-show-previous-frame"]', 'Show Previous Frame?'),
        m('input[type=checkbox]#setting-show-previous-frame', {
          checked: story.showPreviousFrame,
          onchange: () => this.toggleShowPreviousFrame(story)
        }),
      ]),
      m('div.setting', [
        m('label[for="setting-stroke-width"]', 'Stroke Width'),
        m('input[type=range][min=4][max=20][step=4]#setting-stroke-width', {
          value: story.frameStyles.lineWidth,
          oninput: ({target}) => this.setLineWidth(story, target.value)
        }),
        m('span.setting-value', story.frameStyles.lineWidth)
      ])
    ]);
  }

}

export default SettingsComponent;
