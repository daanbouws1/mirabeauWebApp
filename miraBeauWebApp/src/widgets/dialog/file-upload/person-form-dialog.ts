import {autoinject, bindable} from "aurelia-framework";
import {DialogController} from "aurelia-dialog";
import {DialogService} from "aurelia-dialog";
import {InvalidFileDialog} from "./invalid-file-dialog";
import {ValidationRules, ValidationControllerFactory, validateTrigger, ValidationController} from "aurelia-validation";
import {user} from "firebase-functions/lib/providers/auth";

@autoinject(DialogController)

@autoinject
export class PersonFormDialog {

  message: any;
  private addForm: AddForm = new AddForm();
  private uploader: any;
  private selectedDay: any;
  private days: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
  private selectedMonth: any;
  private months: number[] = [1,2,3,4,5,6,7,8,9,10,11,12];
  private selectedYear: any;
  private years: number[] = [1996,1995,1994,1993,1992,1991,1990,1989,1988,1987,1986,1985,1984,
    1983,1982,1981,1980,1979,1978,1977,1976,1975,1974,1973,1972,1971,1970,1969,1968,1967,1966,
    1965,1964,1963,1962,1961,1960,1959,1958,1957,1956,1955,1954,1953,1952,1951,1950,1949,1948,
    1947,1946,1945];
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
    console.log(typeof message);
    if (!(typeof message === "string")) {
      this.addForm.name = message[1].name;
      // let userData = message[1];
      this.addForm.setAge(message[1].age);
      this.addForm.jobTitle = message[1].jobTitle;
      this.message = message[0];
    }
    ValidationRules
      .ensure("name").required().withMessage("Name may not be empty")
      .maxLength(15).withMessage("Name cant contain more than 15 characters")
      .ensure("jobTitle").required().withMessage("Function may not be empty")
      .maxLength(20).withMessage("Job title can't contain more than 20 characters")
      .ensure("file").required().withMessage("No file added, please upload a picture of your face")
      .on(AddForm);

  }

  submitForm(addForm: any) {
    this.validationController.validate({object: this.addForm}).then(result => {
      if(result.valid === true) {
        this.addForm.setAge(this.selectedMonth, this.selectedDay, this.selectedYear);
        this.controller.ok(addForm);
      }
    });
  }

  onFileChange(event) {
    if (event.detail.file) {
      const ext = event.detail.file.name.toString().substr(
          event.detail.file.name.toString().lastIndexOf(".") + 1,
          event.detail.file.name.toString().length) ||
          event.detail.file.name.toString();
      if (!(ext === "png" || ext === "jpg")) {
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
      this.addForm.file = event.detail.file;
      this.csrfilename = event.detail.file.name.toString();
    } else {
      this.csrfilename = null;
      this.csrfile = null;
    }
  }
}

export class AddForm {
	private name: string = "";
	private age: any;
	private jobTitle: string = "";
	public file: any;


  setAge(month: any, day: any, year: any) {
    this.age = year + "-" + month + "-" + day;
  }
}
