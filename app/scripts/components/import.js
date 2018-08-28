import ControlComponent from './control.js';

class ImportComponent {

  setChosenFile(chosenFile) {
    this.chosenFile = chosenFile;
  }

  uploadChosenFile() {
    let reader = new FileReader();
    reader.onload = (event) => {
      let data = event.target.result;
      console.log(data);
      // TODO: write this logic
    };
    reader.readAsText(this.chosenFile);
  }

  view() {
    return m('div.import-options', [
      m('h2', 'Import Story'),
      m('div.import-control-wrapper', [
        m('input[type=file][accept=.flipbook].import-file-input', {
          onchange: ({target}) => this.setChosenFile(target.files[0])
        }),
        m(ControlComponent, {
          id: 'choose-file',
          title: 'Choose File',
          label: 'Choose File...'
        }),
        m('div.import-chosen-file-name', this.chosenFile ? this.chosenFile.name : 'No file chosen')
      ]),
      this.chosenFile ? m(ControlComponent, {
        id: 'upload-file',
        title: 'Upload Now',
        label: 'Upload Now',
        action: () => this.uploadChosenFile()
      }) : null
    ]);
  }

}

export default ImportComponent;
