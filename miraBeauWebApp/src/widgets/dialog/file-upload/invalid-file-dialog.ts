import {autoinject} from "aurelia-framework";
import {DialogController} from "aurelia-dialog";

@autoinject
export class InvalidFileDialog {

  private model: any;
	private message: string;
	private ext: string;
	private message2: string;


	constructor(public controller: DialogController) {
		this.controller = controller;
	}

	activate(model) {
		this.model = model;
	}

	// WHY DAFUCK does this find the browse function in upload-file.ts??
  // something about outer environment link of person-form-dialog??
	browse() {
		this.model.browse();
		this.controller.ok();
	}
}
