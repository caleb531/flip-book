import Sketcher from './sketcher.js';

class App {

  constructor() {
    this.sketcher = new Sketcher({
      canvas: document.querySelector('.current-frame')
    });
    this.bindControlEvents();
  }

  bindControlEvents() {
    document.querySelector('.control-undo').addEventListener('click', () => {
      this.sketcher.undo();
    });
    document.querySelector('.control-redo').addEventListener('click', () => {
      this.sketcher.redo();
    });
  }

}

export default App;
