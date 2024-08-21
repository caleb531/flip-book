import PanelComponent from './panel.jsx';

class StoryListComponent {
  oninit({ attrs: { app } }) {
    this.app = app;
  }

  async selectStory(storyItemElement) {
    await this.app.selectStory(Number(storyItemElement.dataset.index));
    await this.app.save();
    PanelComponent.closeAllPanels();
  }

  view() {
    return (
      <div className="story-list-container">
        <h2>Story List</h2>
        <ul
          className="story-list"
          onclick={({ target }) => this.selectStory(target.closest('.story-list-item'))}
        >
          {this.app.stories.map((storyMetadata, s) => {
            return (
              <li className="story-list-item" data-index={s}>
                {storyMetadata.name}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default StoryListComponent;
