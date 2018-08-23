class AppHeaderComponent {

  view() {
    return m('.app-header', [
      m('h1', 'Flip Book'),
      m('.app-header-mentions', [
        m('span.app-header-mention', [
          m('span.preposition', 'By'),
          m('a[href="https://calebevans.me/"]', 'Caleb Evans'),
          '.'
        ]),
        m('span.app-header-mention', [
          m('span.preposition', 'For'),
          'my friend and brother, Bill.'
        ])
      ])
    ]);
  }

}

export default AppHeaderComponent;
