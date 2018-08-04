import StoryEditor from './story-editor.js';

StoryEditor.restore({
  editorElement: document.querySelector('.story-editor')
});

window.addEventListener('load', () => {
  if (navigator.serviceWorker) {
    navigator.serviceWorker.register('service-worker.js');
  }
});
