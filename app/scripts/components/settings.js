import Story from '../models/story.js';

class SettingsComponent {

  setFrameDuration(story, framesPerSecond) {
    story.setFramesPerSecond(Number(framesPerSecond));
    story.save();
  }

  setPreviousFramesToShow(story, previousFramesToShow) {
    story.previousFramesToShow = Number(previousFramesToShow);
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
          value: story.getFramesPerSecond(),
          oninput: ({target}) => this.setFrameDuration(story, target.value)
        }),
        m('span.setting-value', story.getFramesPerSecond())
      ]),
      m('div.setting', [
        m('label[for="setting-previous-frames"]', 'Previous Frames to Show'),
          m('select#setting-previous-frames', {
            onchange: ({target}) => this.setPreviousFramesToShow(story, target.value)
          }, _.times(Story.maxPreviousFramesToShow + 1, (count) => {
            return m('option', {
              selected: count === story.previousFramesToShow,
              value: count
            }, count);
          }))
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
