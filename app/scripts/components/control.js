class ControlComponent {

  view({attrs: {id, title, icon, action}}) {
    return m('button.control', {
      class: `control-${id}`,
      title,
      onclick: action
    }, m('img', {src: `icons/${icon}.svg`, alt: title}));
  }

}

export default ControlComponent;
