import {autoinject} from "aurelia-framework";
import {DialogController} from "aurelia-dialog";
import {DialogService} from "aurelia-dialog";
import {ValidationRules, ValidationControllerFactory, validateTrigger, ValidationController} from "aurelia-validation";

@autoinject(DialogController)

@autoinject
export class TextFormDialog {

  private createOrUpdate: boolean;
  private room: Room = new Room();
  private message: any;
  private validationController: ValidationController;

  constructor(public controller: DialogController,
              private dialogService: DialogService,
              private controllerFactory: ValidationControllerFactory) {
    this.controller = controller;
    controller.settings.centerHorizontalOnly = true;
    this.validationController = controllerFactory.createForCurrentScope();
    this.validationController.validateTrigger = validateTrigger.manual;
    this.room.category = "Conference Room";
  }

  activate(message: any) {
    if (!(typeof message === "string")) {
      this.createOrUpdate = true;
      this.room.roomName = message[1].name;
      this.room.location = message[1].location;
      this.room.key = message[1].key;
    } else {
      this.createOrUpdate = false;
      this.message = message;
    }

    ValidationRules
      .ensure("roomName").required().withMessage("A conference room must have a name")
      .ensure("location").required().withMessage("A conference room must have a location")
      .on(Room);
  }

  private submitForm() {
    this.validationController.validate({object: this.room}).then(result => {
      if(result.valid === true) {
        this.controller.ok(this.room);
      }
    });
  }
}

class Room {
  public roomName: any;
  public category: any;
  public location: any;
  public key: any;

  constructor() {
    this.roomName = null;
    this.category = null;
    this.location = null;
    this.key = null;
  }
}
