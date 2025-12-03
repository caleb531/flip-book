import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import AppComponent from '../../scripts/components/app.jsx';
import App from '../../scripts/models/app.js';
import Story from '../../scripts/models/story.js';
import { getSelectedTimelineIndex, getTimelineItems, mountComponent } from './setup.js';

describe('keyboard controls', () => {
  it('should let the user navigate frames with keyboard controls', async () => {
    let story = new Story();
    story.addNewFrame();
    story.addNewFrame();
    story.selectFrame(0);

    let app = new App({
      stories: [story.metadata],
      selectedStoryIndex: 0
    });
    app.selectedStory = story;

    vi.spyOn(story, 'play').mockImplementation((onNextFrame) => {
      story.playing = true;
      if (onNextFrame) {
        onNextFrame();
      }
    });
    vi.spyOn(story, 'pause').mockImplementation(() => {
      story.playing = false;
    });
    vi.spyOn(App, 'restore').mockResolvedValue(app);

    mountComponent(AppComponent);

    await screen.findByText('Flip Book');

    let user = userEvent.setup();
    let appElement = screen.getByRole('application', {
      name: /Flip Book application/i
    });
    appElement.focus();

    let timeline = await screen.findByRole('list', { name: /Story timeline/i });

    await waitFor(() => {
      expect(getTimelineItems(timeline)).toHaveLength(3);
      expect(getSelectedTimelineIndex(timeline)).toEqual(0);
    });

    let storyEditor = screen.getByRole('region', { name: /Story editor/i });

    await user.keyboard('{ArrowRight}');
    await waitFor(() => {
      expect(getSelectedTimelineIndex(timeline)).toEqual(1);
    });

    await user.keyboard('{ArrowLeft}');
    await waitFor(() => {
      expect(getSelectedTimelineIndex(timeline)).toEqual(0);
    });

    expect(storyEditor).not.toHaveClass('story-playing');
    await user.keyboard('[Space]');
    await waitFor(() => {
      expect(storyEditor).toHaveClass('story-playing');
    });

    let selectedWhilePlaying = getSelectedTimelineIndex(timeline);
    await user.keyboard('{ArrowRight}');
    await waitFor(() => {
      expect(getSelectedTimelineIndex(timeline)).toEqual(selectedWhilePlaying);
    });

    await user.keyboard('[Space]');
    await waitFor(() => {
      expect(storyEditor).not.toHaveClass('story-playing');
    });

    await user.keyboard('{ArrowRight}');
    await waitFor(() => {
      expect(getSelectedTimelineIndex(timeline)).toEqual(selectedWhilePlaying + 1);
    });
  });
});
