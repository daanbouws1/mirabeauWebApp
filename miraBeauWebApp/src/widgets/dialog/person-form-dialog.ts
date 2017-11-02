import {autoinject} from "aurelia-framework";
import {DialogController} from "aurelia-dialog";
import {DialogService} from "aurelia-dialog";
import {InvalidFileDialog} from "./invalid-file-dialog";

@autoinject(DialogController)

@autoinject
export class PersonFormDialog {

  message: string;
  private addForm: AddForm = new AddForm();

  constructor(public controller: DialogController, private dialogService: DialogService) {
    this.controller = controller;
    controller.settings.centerHorizontalOnly = true;
  }

  activate(message) {
    this.message = message;
  }

  onFileChange(event) {
    if (event.detail.file) {
      const ext = event.detail.file.name.toString().substr(
          event.detail.file.name.toString().lastIndexOf(".") + 1,
          event.detail.file.name.toString().length) ||
          event.detail.file.name.toString();
          console.warn("ext", ext);
      if (ext != "png" || ext != "jpg") {
        this.dialogService.open({
          viewModel: InvalidFileDialog,
          model: {
            title: "Invalid file",
            message: "This file is not an image file, but a",
            ext: ext,
            message2: ". Please select an image file",
            browse: () => this.uploader.browse();
          }
        });
        return;
      }
      this.csrfile = event.detail.file;
      this.csrfilename = event.detail.file.name.toString();
    } else {
      this.csrfilename = null;
      this.csrfile = null;
    }
}
}

class AddForm {
	private name: string = "";
	private age: number;
	private jobTitle: string = "";
}
