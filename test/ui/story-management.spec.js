import { fireEvent, screen, waitFor, within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import AppComponent from '../../scripts/components/app.jsx';
import ProgressBarComponent from '../../scripts/components/progress-bar.jsx';
import App from '../../scripts/models/app.js';
import Story from '../../scripts/models/story.js';
import { mountComponent } from './setup.js';

describe('story management workflow', () => {
  it('guides the user through creating, selecting, deleting, and importing stories', async () => {
    let originalDelay = ProgressBarComponent.delay;
    let user = userEvent.setup();

    class FileReaderStub {
      readAsText(file) {
        if (this.onprogress) {
          this.onprogress({ loaded: file.size, total: file.size });
        }
        if (this.onload) {
          this.onload({ target: { result: file.__text ?? '' } });
        }
      }
    }

    vi.stubGlobal('FileReader', FileReaderStub);
    ProgressBarComponent.delay = 100;

    try {
      let baseStory = new Story();
      vi.spyOn(baseStory, 'save').mockResolvedValue();

      let storiesById = new Map([[baseStory.metadata.createdDate, baseStory]]);

      let app = new App({
        stories: [baseStory.metadata],
        selectedStoryIndex: 0
      });
      app.selectedStory = baseStory;
      app.save = vi.fn().mockResolvedValue();

      app.getSelectedStoryName = vi.fn(async () => app.selectedStory.metadata.name);

      app.selectStory = vi.fn(async (index) => {
        app.selectedStoryIndex = index;
        let metadata = app.stories[index];
        let story = storiesById.get(metadata.createdDate);
        if (!story) {
          story = new Story({ metadata });
          vi.spyOn(story, 'save').mockResolvedValue();
          storiesById.set(metadata.createdDate, story);
        }
        app.selectedStory = story;
        return story;
      });

      app.createNewStoryWithName = vi.fn(async (name) => {
        let story = new Story({
          metadata: { name, createdDate: Date.now() + Math.random() * 1000 }
        });
        vi.spyOn(story, 'save').mockResolvedValue();
        storiesById.set(story.metadata.createdDate, story);
        app.stories.unshift(story.metadata);
        await app.selectStory(0);
        await app.save();
      });

      app.renameSelectedStory = vi.fn(async (name) => {
        app.selectedStory.metadata.name = name;
        app.stories[app.selectedStoryIndex].name = name;
        await app.save();
      });

      app.deleteSelectedStory = vi.fn(async () => {
        if (app.stories.length === 1) {
          let replacement = new Story();
          vi.spyOn(replacement, 'save').mockResolvedValue();
          storiesById.set(replacement.metadata.createdDate, replacement);
          app.stories.splice(0, 1, replacement.metadata);
          await app.selectStory(0);
        } else {
          app.stories.splice(app.selectedStoryIndex, 1);
          let nextIndex = Math.max(0, app.selectedStoryIndex - 1);
          await app.selectStory(nextIndex);
        }
        await app.save();
      });

      app.addExistingStory = vi.fn(async (story) => {
        vi.spyOn(story, 'save').mockResolvedValue();
        storiesById.set(story.metadata.createdDate, story);
        app.stories.unshift(story.metadata);
        await app.selectStory(0);
        await app.save();
      });

      vi.spyOn(App, 'restore').mockResolvedValue(app);

      let promptValues = ['Holiday Story', 'Renamed Story'];
      let promptMock = vi.spyOn(window, 'prompt').mockImplementation(() => promptValues.shift());
      let confirmMock = vi.spyOn(window, 'confirm').mockReturnValue(true);

      mountComponent(AppComponent);

      await screen.findByText('Flip Book');
      await screen.findByText('My First Story');

      await user.click(screen.getByRole('button', { name: /Create New Story/i }));
      await waitFor(() => {
        expect(screen.getByText('Holiday Story')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /Rename Story/i }));
      await waitFor(() => {
        expect(screen.getByText('Renamed Story')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /Open Story/i }));
      let storyListHeading = await screen.findByRole('heading', { name: /Story List/i });
      let storyList = storyListHeading.nextElementSibling;
      let listItems = within(storyList).getAllByRole('listitem');
      expect(listItems.length).toBeGreaterThanOrEqual(2);
      let originalStoryItem = within(storyList).getByText('My First Story');
      await user.click(originalStoryItem);
      await waitFor(() => {
        expect(screen.getByText('My First Story')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /Delete Story/i }));
      await waitFor(() => {
        expect(screen.getByText('Renamed Story')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /Import Story/i }));
      let importHeading = await screen.findByRole('heading', { name: /Import Story/i });
      let fileInput = importHeading.parentElement.querySelector('.import-file-input');

      let importedStoryData = {
        metadata: { name: 'Imported Story', createdDate: Date.now() + 5000 },
        frames: [{}],
        frameDuration: 100,
        numPreviousFramesToShow: 1,
        frameStyles: { strokeStyle: '#000', lineWidth: 12 },
        exportedGifSize: 720
      };
      let importedStoryFile = new File([JSON.stringify(importedStoryData)], 'imported.flipbook', {
        type: 'application/json'
      });
      importedStoryFile.__text = JSON.stringify(importedStoryData);

      fireEvent.change(fileInput, {
        target: {
          files: [importedStoryFile]
        }
      });
      await waitFor(() => {
        expect(screen.getByText('imported.flipbook')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /Upload Now/i }));
      await waitFor(() => {
        expect(document.querySelector('.progress-bar')).toBeTruthy();
      });
      await waitFor(() => {
        expect(screen.getByText(/Imported Story" successfully added!/i)).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('Imported Story')).toBeInTheDocument();
      });

      expect(app.createNewStoryWithName).toHaveBeenCalledWith('Holiday Story');
      expect(app.renameSelectedStory).toHaveBeenCalledWith('Renamed Story');
      expect(app.deleteSelectedStory).toHaveBeenCalled();
      expect(app.addExistingStory).toHaveBeenCalled();
      expect(promptMock).toHaveBeenCalled();
      expect(confirmMock).toHaveBeenCalled();
    } finally {
      ProgressBarComponent.delay = originalDelay;
      vi.unstubAllGlobals();
    }
  });
});
