import { fireEvent, screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import SettingsComponent from '../../scripts/components/settings.jsx';
import Story from '../../scripts/models/story.js';
import { mountComponent } from './setup.js';

describe('settings controls', () => {
  it('adjusts playback speed, onion skin count, and line width with bounds', async () => {
    let story = new Story({
      frameDuration: 200,
      numPreviousFramesToShow: 2,
      frameStyles: {
        lineWidth: 8
      }
    });
    vi.spyOn(story, 'save').mockResolvedValue();

    mountComponent(SettingsComponent, { story });

    await screen.findByText('Settings');

    let user = userEvent.setup();

    let fpsSlider = screen.getByLabelText('FPS');
    fireEvent.input(fpsSlider, { target: { value: '12' } });
    await waitFor(() => {
      expect(story.getFramesPerSecond()).toBe(12);
      expect(story.save).toHaveBeenCalledTimes(1);
    });

    let incrementButton = screen.getByRole('button', {
      name: /Show One More Previous Frame/i
    });
    for (let i = 0; i < 5; i += 1) {
      await user.click(incrementButton);
    }
    await waitFor(() => {
      expect(story.numPreviousFramesToShow).toBe(4);
    });

    let decrementButton = screen.getByRole('button', {
      name: /Show One Less Previous Frame/i
    });
    for (let i = 0; i < 6; i += 1) {
      await user.click(decrementButton);
    }
    await waitFor(() => {
      expect(story.numPreviousFramesToShow).toBe(0);
    });

    let strokeWidthSlider = screen.getByLabelText('Stroke Width');
    fireEvent.input(strokeWidthSlider, { target: { value: '16' } });
    await waitFor(() => {
      expect(story.frameStyles.lineWidth).toBe(16);
      expect(story.save).toHaveBeenCalledTimes(1 + 5 + 6 + 1);
    });
  });
});
