import {autoinject} from "aurelia-framework";
import {DialogController} from "aurelia-dialog";
import {DialogService} from "aurelia-dialog";
import {InvalidFileDialog} from "./invalid-file-dialog";

@autoinject(DialogController)

@autoinject
export class PersonFormDialog {

  message: string;
  private addForm: AddForm = new AddForm();
  private uploader: any;
  private csrfile: any;
  private csrfilename: string;

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
          console.warn("ext", ext === "png");
      if (!(ext === "png" || ext === "jpg")) {
      	console.warn("a");
        this.dialogService.open({
          viewModel: InvalidFileDialog,
          model: {
            title: "Invalid file",
            message: "This file is not an image file, but a",
            ext: ext,
            message2: ". Please select an image file",
            browse: () => this.uploader.browse()
          }
        });
        return;
      }
      this.csrfile = event.detail.file;
      this.csrfilename = event.detail.file.name.toString();
      console.log(this.csrfilename);
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