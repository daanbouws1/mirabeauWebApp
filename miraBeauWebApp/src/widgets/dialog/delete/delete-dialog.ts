import { autoinject } from "aurelia-framework";
import { DialogController } from "aurelia-dialog";

@autoinject(DialogController)

@autoinject
export class DeleteDialog {

  message: string;

  constructor(public controller: DialogController) {
    this.controller = controller;
    controller.settings.centerHorizontalOnly = true;
  }

  activate(message) {
    this.message = message;
  }
}
