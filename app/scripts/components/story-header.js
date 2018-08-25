class StoryHeaderComponent {

  view({attrs: {story}}) {
    return m('div.story-header', [
      m('span.selected-story-name', story.metadata.name)
    ]);
  }

}

export default StoryHeaderComponent;
