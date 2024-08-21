import m from 'mithril';

class LoadingComponent {
  view({ attrs }) {
    return m('div.loading', attrs, [
      m('svg[viewBox="0 0 24 24"]', [
        m('path', { d: 'M 3,12 A 6,6 0,0,0 21,12' })
      ])
    ]);
  }
}

export default LoadingComponent;
