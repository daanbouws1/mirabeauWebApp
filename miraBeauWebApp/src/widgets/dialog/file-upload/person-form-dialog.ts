import {autoinject} from "aurelia-framework";
import {DialogController} from "aurelia-dialog";
import {DialogService} from "aurelia-dialog";
import {InvalidFileDialog} from "./invalid-file-dialog";
import {PictureManager} from "../picture-manager/picture-manager";
import {ValidationRules, ValidationControllerFactory, validateTrigger, ValidationController} from "aurelia-validation";

@autoinject(DialogController)

@autoinject
export class PersonFormDialog {

  message: any;
  private createOrUpdate: boolean;
  private addForm: AddForm = new AddForm();
  private uploader: any;
  private selectedDay: any;
  private showDaysDropdown: boolean = false;
  private days: number[];
  private selectedMonth: any;
  private selectedYear: any;
  private csrfile: any;
  private csrfilename: string;
  private validationController: ValidationController;
  private filePresent: boolean;
  private hasFocus: any;
  private messageBool: boolean;
  private myKeypressCallback: any;
  private currentYear;

  constructor(public controller: DialogController,
              private dialogService: DialogService,
              private controllerFactory: ValidationControllerFactory) {
    //set validation
    this.controller = controller;
    this.validationController = controllerFactory.createForCurrentScope();
    this.validationController.validateTrigger = validateTrigger.manual;
    //center dialog
    controller.settings.centerHorizontalOnly = true;
    //set keylistener
    this.myKeypressCallback = this.keypressInput.bind(this);
  }

  activate(message) {
    //check if user clicked add or edit and load data accordingly
    this.message = message;
    this.currentYear = (new Date()).getFullYear();
    if (!(typeof message === "string")) {
      this.addForm.id = message[1].id;
      this.addForm.name = message[1].name;
      this.addForm.age = message[1].age;
      this.addForm.jobTitle = message[1].jobTitle;
      this.addForm.message = message[1].message;
      this.selectedYear = message[1].age.substring(0,4);
      this.selectedMonth = message[1].age.substring(5,7);
      this.selectedDay = message[1].age.substring(8,10);
      this.createOrUpdate = true;
    } else {
      this.createOrUpdate = false;
    }
    // add keylistener
    window.addEventListener('keypress', this.myKeypressCallback, false);
    this.hasFocus = true;
    // set validation rules
    ValidationRules
      .ensure("name").required().withMessage("Name may not be empty")
      .maxLength(25).withMessage("Name cant contain more than 20 characters")
      .ensure("jobTitle").required().withMessage("Function may not be empty")
      .maxLength(25).withMessage("Job title can't contain more than 25 characters")
      .on(AddForm);

    this.messageBool = false;
  }

  deactivate() {
    // remove keylistener
    window.removeEventListener('keypress', this.myKeypressCallback);
  }

  private keypressInput(e) {
    //listen for enter and submit form
    if (e.code === "Enter") {
      this.submitForm();
    }
  }

  private openPhotoDialog() {
    window.removeEventListener('keypress', this.myKeypressCallback);
    this.dialogService.open({
      viewModel: PictureManager,
      model: this.addForm.id
    }).whenClosed(result => {
      window.addEventListener('keypress', this.myKeypressCallback, false);
    });
  }

  private submitForm() {
    //Send form to firebase and azure.
    this.validationController.validate({object: this.addForm}).then(result => {
      if(result.valid === true) {
        if (this.addForm.message.indexOf(",") == -1) {
          this.addForm.age = this.selectedYear + "-" + this.selectedMonth + "-" + this.selectedDay;
          if (this.addForm.file == null && this.createOrUpdate == false) {
            this.filePresent = false;
          } else {
            this.controller.ok(this.addForm);
          }
        } else {
          this.messageBool = true;
        }
      }
    });
  }

  private selectMonth(month: any) {
    this.selectedMonth = month;
    this.showDaysDropdown = true;
    this.days = new Date(this.currentYear, month, 0).getDate();
  }

  private selectDay(day: any) {
    this.selectedDay = day;
  }

  private onFileChange(event) {
    //check if file has right extension
    if (event.detail.file) {
      const ext = event.detail.file.name.toString().substr(
          event.detail.file.name.toString().lastIndexOf(".") + 1,
          event.detail.file.name.toString().length) ||
          event.detail.file.name.toString();
      if (!(ext === "png" || ext === "jpg")) {
        //tell user to try again and open dialog that lets them do so.
        this.dialogService.open({
          viewModel: InvalidFileDialog,
          model: {
            title: "Invalid file",
            message: "This file is not an image file, but a",
            ext: ext,
            message2: ". Please select an image file",
            // opens up another upload-file dialog by calling the browse() function from upload-file.ts
            browse: () => this.uploader.browse()
          }
        });
        return;
      }
      this.addForm.file = event.detail.file;
      this.csrfilename = event.detail.file.name.toString();
    } else {
      this.csrfilename = null;
      this.csrfile = null;
    }
  }
}

export class AddForm {
  public id: string = "";
	public name: string = "";
	public age: any;
	public jobTitle: string = "";
	public file: any;
	public message: string = "";
}
