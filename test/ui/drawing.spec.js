import { fireEvent, screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import StoryEditorComponent from '../../scripts/components/story-editor.jsx';
import Story from '../../scripts/models/story.js';
import { canvasIsDrawn, getTimelineItems, mountComponent } from './setup.js';

describe('drawing workflow', () => {
  it('should let the user draw strokes and manage frames', async () => {
    let story = new Story();
    mountComponent(StoryEditorComponent, { story });

    let user = userEvent.setup();
    let canvas = await screen.findByLabelText('Current frame');

    Object.defineProperty(canvas, 'offsetWidth', {
      configurable: true,
      value: canvas.width
    });
    Object.defineProperty(canvas, 'offsetHeight', {
      configurable: true,
      value: canvas.height
    });
    Object.defineProperty(canvas.parentElement, 'offsetLeft', {
      configurable: true,
      value: 0
    });
    Object.defineProperty(canvas.parentElement, 'offsetTop', {
      configurable: true,
      value: 0
    });

    expect(canvasIsDrawn(canvas)).toBe(false);

    fireEvent.mouseDown(canvas, {
      bubbles: true,
      clientX: 10,
      clientY: 15,
      pageX: 10,
      pageY: 15,
      buttons: 1
    });
    fireEvent.mouseMove(canvas, {
      bubbles: true,
      clientX: 30,
      clientY: 45,
      pageX: 30,
      pageY: 45,
      buttons: 1
    });
    fireEvent.mouseUp(canvas, {
      bubbles: true,
      clientX: 30,
      clientY: 45,
      pageX: 30,
      pageY: 45
    });

    await waitFor(() => {
      expect(canvasIsDrawn(canvas)).toBe(true);
    });

    let undoButton = screen.getByRole('button', { name: /Undo Stroke/i });
    await user.click(undoButton);

    await waitFor(() => {
      expect(canvasIsDrawn(canvas)).toBe(false);
    });

    let redoButton = screen.getByRole('button', { name: /Redo Stroke/i });
    await user.click(redoButton);

    await waitFor(() => {
      expect(canvasIsDrawn(canvas)).toBe(true);
    });

    let duplicateButton = screen.getByRole('button', { name: /Duplicate Current Frame/i });
    await user.click(duplicateButton);

    let timeline = await screen.findByRole('list', { name: /Story timeline/i });

    await waitFor(() => {
      expect(getTimelineItems(timeline)).toHaveLength(2);
    });
    await waitFor(() => {
      expect(getTimelineItems(timeline)[1]).toHaveClass('selected');
    });

    await user.click(getTimelineItems(timeline)[0]);

    await waitFor(() => {
      let items = getTimelineItems(timeline);
      expect(items[0]).toHaveClass('selected');
      expect(items[1]).not.toHaveClass('selected');
    });
  });
});
