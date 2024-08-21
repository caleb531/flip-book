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

  view({ attrs: { story } }) {
    return (
      <div className="settings">
        <h2>Settings</h2>
        <div className="setting">
          <label htmlFor="setting-fps">FPS</label>
          <input
            type="range"
            min="2"
            max="30"
            step="2"
            id="setting-fps"
            value={story.getFramesPerSecond()}
            oninput={({ target }) => this.setFrameDuration(story, target.value)}
          />
          <span className="setting-value">{story.getFramesPerSecond()}</span>
        </div>
        <div className="setting">
          <label>Previous Frames to Show</label>
          <ControlComponent
            id="decrement-previous-frames"
            title="Show One Less Previous Frame"
            icon="decrement"
            action={() => this.decrementNumPreviousFramesToShow(story)}
          />
          <span className="setting-value setting-value-previous-frames">
            {story.numPreviousFramesToShow}
          </span>
          <ControlComponent
            id="increment-previous-frames"
            title="Show One More Previous Frame"
            icon="increment"
            action={() => this.incrementNumPreviousFramesToShow(story)}
          />
        </div>
        <div className="setting">
          <label htmlFor="setting-stroke-width">Stroke Width</label>
          <input
            type="range"
            min="4"
            max="20"
            step="4"
            id="setting-stroke-width"
            value={story.frameStyles.lineWidth}
            oninput={({ target }) => this.setLineWidth(story, target.value)}
          />
          <span className="setting-value">{story.frameStyles.lineWidth}</span>
        </div>
      </div>
    );
  }
}

export default SettingsComponent;
