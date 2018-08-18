import AppComponent from './components/app.js';

m.mount(document.querySelector('main'), AppComponent);

window.addEventListener('load', () => {
  if (navigator.serviceWorker) {
    navigator.serviceWorker.register('service-worker.js');
  }
});
