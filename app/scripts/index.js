import App from './app.js';

new App();

window.addEventListener('load', () => {
  if (navigator.serviceWorker) {
    navigator.serviceWorker.register('service-worker.js');
  }
});
