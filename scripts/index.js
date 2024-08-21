import m from 'mithril';
import AppComponent from './components/app.jsx';
import '../styles/index.scss';
import '@fontsource/roboto-slab/400.css';
import '@fontsource/roboto-slab/600.css';

m.mount(document.querySelector('main'), AppComponent);
