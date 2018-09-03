import Story from '../models/story.js';

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
        m('select#setting-fps', {
          onchange: ({target}) => this.setFrameDuration(story, target.value),
        }, Story.fpsOptions.map((fpsOption) => {
          return m('option', {
            value: fpsOption,
            selected: story.getFPS() === fpsOption
          }, `${fpsOption} fps`);
        }))
      ]),
      m('div.setting', [
        m('label[for="setting-show-previous-frame"]', 'Show Previous Frame?'),
        m('input[type=checkbox]#setting-show-previous-frame', {
          checked: story.showPreviousFrame,
          onchange: () => this.toggleShowPreviousFrame(story)
        }),
      ]),
      m('div.setting', [
        m('label[for="setting-line-width"]', 'Stroke Width'),
        m('input[type=range][min=4][max=20][step=4]#setting-line-width', {
          value: story.frameStyles.lineWidth,
          onchange: ({target}) => this.setLineWidth(story, target.value)
        }),
      ])
    ]);
  }

}

export default SettingsComponent;
