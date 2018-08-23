class AppHeaderComponent {

  view() {
    return m('.app-header', [
      m('h1', 'Flip Book'),
      m('.app-header-mentions', [
        m('span.app-header-mention', [
          'By ',
          m('a[href="https://calebevans.me/"]', 'Caleb Evans'),
          '.'
        ]),
        m('span.app-header-mention', [
          'For my friend and brother, Bill.'
        ])
      ])
    ]);
  }

}

export default AppHeaderComponent;
