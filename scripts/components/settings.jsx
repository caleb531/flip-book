import m from 'mithril';
import ControlComponent from './control.jsx';

class SettingsComponent {

  async setFrameDuration(story, framesPerSecond) {
    story.setFramesPerSecond(Number(framesPerSecond));
    await story.save();
  }

  async incrementNumPreviousFramesToShow(story) {
    story.numPreviousFramesToShow = Math.min(story.numPreviousFramesToShow + 1, 4);
    await story.save();
  }

  async decrementNumPreviousFramesToShow(story) {
    story.numPreviousFramesToShow = Math.max(0, story.numPreviousFramesToShow - 1);
    await story.save();
  }

  async setLineWidth(story, lineWidth) {
    story.frameStyles.lineWidth = Number(lineWidth);
    await story.save();
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
        m('label', 'Previous Frames to Show'),
        m(ControlComponent, {
          id: 'decrement-previous-frames',
          title: 'Show One Less Previous Frame',
          icon: 'decrement',
          action: () => this.decrementNumPreviousFramesToShow(story)
        }),
        m('span.setting-value.setting-value-previous-frames', story.numPreviousFramesToShow),
        m(ControlComponent, {
          id: 'increment-previous-frames',
          title: 'Show One More Previous Frame',
          icon: 'increment',
          action: () => this.incrementNumPreviousFramesToShow(story)
        })
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
