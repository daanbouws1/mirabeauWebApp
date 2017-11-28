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
  //days in a month
  private days: string[] = ["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"];
  private selectedMonth: any;
  // months in a year
  private months: string[] = ["01","02","03","04","05","06","07","08","09","10","11","12"];
  private selectedYear: any;
  // years you might be born in
  private years: number[] = [2000,1999,1998,1997,1996,1995,1994,1993,1992,1991,1990,1989,1988,1987,1986,1985,1984,
    1983,1982,1981,1980,1979,1978,1977,1976,1975,1974,1973,1972,1971,1970,1969,1968,1967,1966,
    1965,1964,1963,1962,1961,1960,1959,1958,1957,1956,1955,1954,1953,1952,1951,1950,1949,1948,
    1947,1946,1945];
  private csrfile: any;
  private csrfilename: string;
  private validationController: ValidationController;
  private filePresent: boolean;
  private hasFocus: any;
  private messageBool: boolean;

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
      .maxLength(20).withMessage("Name cant contain more than 20 characters")
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
