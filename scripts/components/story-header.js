import m from 'mithril';
import ControlComponent from './control.js';
import PanelComponent from './panel.js';
import StoryListComponent from './story-list.js';
import ImportComponent from './import.js';

class StoryHeaderComponent {

  oninit({attrs: {app}}) {
    this.app = app;
  }

  createNewStoryWithName() {
    // Prevent the synchronous prompt() call from blocking the main thread; this
    // will allow Mithril to redraw and close all panels before showing the
    // modal
    setTimeout(() => {
      let storyName = prompt('Please enter a name for your new story:') || '';
      if (storyName.trim()) {
        this.app.createNewStoryWithName(storyName.trim());
        PanelComponent.closeAllPanels();
        m.redraw();
      }
    });
  }

  renameSelectedStory() {
    // Prevent the synchronous confirm() call from blocking the main thread;
    // this will allow Mithril to redraw and close all panels before showing the
    // modal
    setTimeout(() => {
      let newStoryName = prompt('Enter the new name for your story:', this.app.getSelectedStoryName()) || '';
      if (newStoryName.trim()) {
        this.app.renameSelectedStory(newStoryName.trim());
        m.redraw();
      }
    });
  }

  deleteSelectedStory() {
    // Prevent the synchronous confirm() call from blocking the main thread;
    // this will allow Mithril to redraw and close all panels before showing the
    // modal
    setTimeout(() => {
      if (confirm('Are you sure you want to delete this story? This cannot be undone.')) {
        this.app.deleteSelectedStory();
        m.redraw();
      }
    });
  }

  view({attrs: {story}}) {
    return m('div.story-header', [
      m('.control-group', [
        m(ControlComponent, {
          id: 'create-new-story',
          title: 'Create New Story',
          icon: 'add',
          action: () => this.createNewStoryWithName()
        }),
        m(ControlComponent, {
          id: 'open-story',
          title: 'Open Story',
          icon: 'folder',
          panel: m(StoryListComponent, {app: this.app}),
          panelPosition: 'bottom'
        }),
        m(ControlComponent, {
          id: 'import-story',
          title: 'Import Story',
          icon: 'upload',
          panel: m(ImportComponent, {app: this.app}),
          panelPosition: 'bottom'
        })
      ]),
      m('span.selected-story-name', story.metadata.name),
      m(ControlComponent, {
        id: 'rename-story',
        title: 'Rename Story',
        icon: 'edit',
        action: () => this.renameSelectedStory()
      }),
      m('.control-group', [
        m(ControlComponent, {
          id: 'delete-story',
          title: 'Delete Story',
          icon: 'delete',
          action: () => this.deleteSelectedStory()
        }),
        m(ControlComponent, {
          id: 'help',
          title: 'Help',
          icon: 'help',
          action: () => {
            window.open('https://github.com/caleb531/flip-book#how-to-use');
          }
        })
      ])
    ]);
  }

}

export default StoryHeaderComponent;
