import Sketcher from './sketcher.js';

class App {

  constructor() {
    this.sketcher = new Sketcher({
      canvas: document.querySelector('.current-frame')
    });
  }

}

export default App;
