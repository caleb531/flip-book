import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ExportComponent from '../../scripts/components/export.jsx';
import ProgressBarComponent from '../../scripts/components/progress-bar.jsx';
import Story from '../../scripts/models/story.js';
import { mountComponent } from './setup.js';

vi.mock('gif.js.optimized', () => {
  return {
    default: class GIFMock {
      constructor() {
        this.handlers = {};
        this.frames = [];
        this.running = false;
        this.finishedFrames = 0;
      }

      addFrame(canvas, options) {
        this.frames.push({ canvas, options });
      }

      on(event, callback) {
        this.handlers[event] = callback;
      }

      render() {
        this.running = true;
        this.finishedFrames = 0;
        setTimeout(() => {
          if (this.handlers.progress) {
            this.handlers.progress(this.frames.length > 0 ? 0.5 : 1);
            this.handlers.progress(1);
          }
          this.finishedFrames = this.frames.length;
          this.running = false;
          if (this.handlers.finished) {
            this.handlers.finished(new Blob(['gif-data']));
          }
        });
      }

      abort() {
        this.running = false;
      }
    }
  };
});

vi.mock('gif.js.optimized/dist/gif.worker.js?url', () => ({
  default: 'gif-worker.js'
}));

describe('export workflow', () => {
  it('exports a GIF and project data while honoring size changes', async () => {
    let originalDelay = ProgressBarComponent.delay;
    ProgressBarComponent.delay = 5;

    let createObjectURLValues = [];
    let originalCreateObjectURL = URL.createObjectURL;
    let restoreCreateObjectURL;
    if (originalCreateObjectURL) {
      let spy = vi.spyOn(URL, 'createObjectURL').mockImplementation(() => {
        let value = `blob:mock-${Math.random().toString(16).slice(2)}`;
        createObjectURLValues.push(value);
        return value;
      });
      restoreCreateObjectURL = () => spy.mockRestore();
    } else {
      URL.createObjectURL = (blob) => {
        let value = `blob:mock-${Math.random().toString(16).slice(2)}`;
        createObjectURLValues.push(value);
        return value;
      };
      restoreCreateObjectURL = () => {
        delete URL.createObjectURL;
      };
    }
    let anchorClicks = [];
    let anchorClickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(function () {
        anchorClicks.push({ href: this.href, download: this.download });
      });

    class ImageStub {
      set src(value) {
        this._src = value;
        if (this.onload) {
          this.onload();
        }
      }

      get src() {
        return this._src;
      }
    }
    vi.stubGlobal('Image', ImageStub);

    try {
      let story = new Story({
        frames: [storyFrame(), storyFrame()],
        metadata: { name: 'GIF Test Story' },
        exportedGifSize: 720
      });
      vi.spyOn(story, 'save').mockResolvedValue();

      mountComponent(ExportComponent, { story });

      await screen.findByText('Export');

      let user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: /Export GIF/i }));

      await waitFor(() => {
        expect(document.querySelector('.export-gif-screen.visible')).toBeTruthy();
      });

      await waitFor(() => {
        expect(screen.getByText('GIF Generated!')).toBeInTheDocument();
      });
      let exportedImage = await screen.findByAltText('Exported GIF');
      expect(exportedImage.src).toMatch(/^blob:mock-/);

      await user.click(screen.getByRole('button', { name: /Close overlay/i }));
      await waitFor(() => {
        expect(document.querySelector('.export-gif-screen.visible')).toBeNull();
      });

      let sizeSelect = screen.getByLabelText('GIF Size:');
      await user.selectOptions(sizeSelect, ['540']);
      await waitFor(() => {
        expect(story.exportedGifSize).toBe(540);
        expect(story.save).toHaveBeenCalled();
      });

      await user.click(screen.getByRole('button', { name: /Export Project Data/i }));
      expect(anchorClicks).toHaveLength(1);
      expect(anchorClicks[0].download).toBe('gif-test-story.flipbook');
      expect(anchorClicks[0].href).toMatch(/^blob:mock-/);
    } finally {
      anchorClickSpy.mockRestore();
      restoreCreateObjectURL();
      vi.unstubAllGlobals();
      ProgressBarComponent.delay = originalDelay;
    }
  });
});

function storyFrame() {
  return {
    styles: {
      strokeStyle: '#123',
      lineWidth: 12
    },
    strokeGroups: [
      {
        points: [
          [0, 0],
          [5, 5]
        ],
        styles: {
          lineWidth: 12
        }
      }
    ]
  };
}
