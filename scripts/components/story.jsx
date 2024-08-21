import StoryHeaderComponent from './story-header.jsx';
import StoryEditorComponent from './story-editor.jsx';

class StoryComponent {
  view({ attrs: { app, story } }) {
    return (
      <div className="story">
        <StoryHeaderComponent app={app} story={story} />
        <StoryEditorComponent story={story} />
      </div>
    );
  }
}

export default StoryComponent;
