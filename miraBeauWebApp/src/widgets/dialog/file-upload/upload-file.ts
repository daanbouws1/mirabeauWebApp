import {bindable, autoinject} from "aurelia-framework";

@autoinject
export class UploadFile {
  @bindable file;
  @bindable filename;

  fileForm: HTMLFormElement;
  fileInput: HTMLInputElement;

  private _selectedFiles: any;

  constructor(private element: Element) {
  }

  get selectedFiles() {
    return this._selectedFiles;
  }

  set selectedFiles(value) {
    this._selectedFiles = value;
    this.element.dispatchEvent(new CustomEvent("filechange", {
      bubbles: true,
      detail: {
        file: (value && value.length !== 0) ? value[0] : null
      }
    }));
    this.fileForm.reset();
  }

  reset() {
    this.selectedFiles = null;
  }

  browse() {
    this.fileInput.click();
  }
}