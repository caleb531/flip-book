import { within } from '@testing-library/dom';
import '@testing-library/jest-dom/vitest';
import m from 'mithril';
import { afterEach, beforeEach, vi } from 'vitest';

import PanelComponent from '../../scripts/components/panel.jsx';

vi.mock('virtual:pwa-register', () => ({
  registerSW: vi.fn(() => vi.fn())
}));

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

      render() {}

      abort() {
        this.running = false;
      }
    }
  };
});

vi.mock('gif.js.optimized/dist/gif.worker.js?url', () => ({
  default: 'gif-worker.js'
}));

let activeMount;
let originalGetContext;
let originalToDataURL;
let canvasContexts;

beforeEach(() => {
  document.body.innerHTML = '';
  PanelComponent.closeAllPanels();
  activeMount = null;
  canvasContexts = new WeakMap();
  originalGetContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type) {
    if (type === '2d') {
      if (!canvasContexts.has(this)) {
        canvasContexts.set(this, createContextStub(this));
      }
      return canvasContexts.get(this);
    }
    return originalGetContext ? originalGetContext.call(this, type) : null;
  };
  originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
  HTMLCanvasElement.prototype.toDataURL = function () {
    return this.__toDataURLValue ?? 'data:image/png;base64,blank-0';
  };
  try {
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: undefined
    });
  } catch (error) {
    navigator.serviceWorker = undefined;
  }
  localStorage.clear();
  sessionStorage.clear();
});

afterEach(() => {
  if (activeMount) {
    activeMount.unmount();
  }
  if (originalGetContext) {
    HTMLCanvasElement.prototype.getContext = originalGetContext;
  } else {
    delete HTMLCanvasElement.prototype.getContext;
  }
  if (originalToDataURL) {
    HTMLCanvasElement.prototype.toDataURL = originalToDataURL;
  } else {
    delete HTMLCanvasElement.prototype.toDataURL;
  }
  vi.restoreAllMocks();
});

export function mountVNode(vnode) {
  if (activeMount) {
    activeMount.unmount();
  }
  let container = document.createElement('div');
  document.body.appendChild(container);
  m.mount(container, vnode);
  activeMount = {
    container,
    unmount() {
      m.mount(container, null);
      container.remove();
      activeMount = null;
    }
  };
  return activeMount;
}

export function mountComponent(component, attrs) {
  return mountVNode({
    view: () => m(component, attrs)
  });
}

export function canvasIsDrawn(canvas) {
  return canvas.toDataURL().includes('drawn');
}

export function getTimelineItems(timeline) {
  return within(timeline).getAllByRole('listitem');
}

export function getSelectedTimelineIndex(timeline) {
  return getTimelineItems(timeline).findIndex((item) => item.classList.contains('selected'));
}

function createContextStub(canvas) {
  let renderVersion = 0;

  if (!canvas.__toDataURLValue) {
    canvas.__toDataURLValue = 'data:image/png;base64,blank-0';
  }

  function updateSnapshot(drawn) {
    renderVersion += 1;
    canvas.__toDataURLValue = `data:image/png;base64,${drawn ? 'drawn' : 'blank'}-${renderVersion}`;
  }

  return {
    canvas,
    resetTransform: vi.fn(),
    clearRect: vi.fn(() => {
      updateSnapshot(false);
    }),
    scale: vi.fn(),
    fillRect: vi.fn(() => {
      updateSnapshot(true);
    }),
    beginPath: vi.fn(),
    arc: vi.fn(() => {
      updateSnapshot(true);
    }),
    fill: vi.fn(() => {
      updateSnapshot(true);
    }),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(() => {
      updateSnapshot(true);
    }),
    stroke: vi.fn(),
    strokeStyle: '#000',
    lineCap: 'round',
    lineJoin: 'round',
    lineWidth: 1,
    fillStyle: 'transparent'
  };
}
