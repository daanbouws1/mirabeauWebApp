import {autoinject} from "aurelia-framework";
import {DialogController} from "aurelia-dialog";

export class InvalidFileDialog {

	private message: string;
	private ext: ext;
	private message2: string;


	constructor(public controller: DialogController) {
		this.controller = controller;
		//controller.settings.centerHorizontalOnly = true;
	}

	activate(model) {
		this.model = model;
	}

	browse(){
		console.warn("HIJ KOMT HIER GEK");
		this.model.browse();
		this.controller.cancel();
	}
}