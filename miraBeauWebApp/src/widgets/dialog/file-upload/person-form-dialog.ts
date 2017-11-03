import {autoinject} from "aurelia-framework";
import {DialogController} from "aurelia-dialog";
import {DialogService} from "aurelia-dialog";
import {InvalidFileDialog} from "./invalid-file-dialog";
import {ConfirmDialog} from "../confirm/confirm-dialog"
import {ValidationRules, ValidationControllerFactory, validateTrigger, ValidationController} from "aurelia-validation";

@autoinject(DialogController)

@autoinject
export class PersonFormDialog {

  message: string;
  private addForm: AddForm = new AddForm();
  private uploader: any;
  private csrfile: any;
  private csrfilename: string;
  private validationController: ValidationController;

  constructor(public controller: DialogController,
              private dialogService: DialogService,
              private controllerFactory: ValidationControllerFactory) {
    this.controller = controller;
    this.validationController = controllerFactory.createForCurrentScope();
    this.validationController.validateTrigger = validateTrigger.manual;
    controller.settings.centerHorizontalOnly = true;
  }

  activate(message) {
    this.message = message;

    ValidationRules
      .ensure("name").required().withMessage("Name may not be empty")
      .maxLength(15).withMessage("Name cant contain more than 15 characters")
      .ensure("jobTitle").required().withMessage("Function may not be empty")
      .maxLength(20).withMessage("Job title can't contain more than 20 characters")
      .on(AddForm);
  }

  submitForm(addForm: any) {
    console.log(addForm);
    this.validationController.validate({object: this.addForm}).then(result => {
      console.log(result);
      if(result.valid === true) {
        console.log("validation passed");
        this.dialogService.open({
          viewModel: ConfirmDialog,
          model: {message: "Are you sure you want to generate this csr?"}
        }).whenClosed(response => {

        });
      } else {

      }
    });

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
      console.log("dit is het bestandje", this.csrfilename);
    } else {
      this.csrfilename = null;
      this.csrfile = null;
    }
  }
}

export class AddForm {
	private name: string = "";
	private age: number;
	private jobTitle: string = "";
}
