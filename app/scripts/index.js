import App from './app.js';

new App({
  appElement: document.querySelector('.app')
});

window.addEventListener('load', () => {
  if (navigator.serviceWorker) {
    navigator.serviceWorker.register('service-worker.js');
  }
});
