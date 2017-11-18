import {autoinject} from "aurelia-framework";
import {DialogController} from "aurelia-dialog";
import {DialogService} from "aurelia-dialog";
import {ValidationRules, ValidationControllerFactory, validateTrigger, ValidationController} from "aurelia-validation";

@autoinject(DialogController)

@autoinject
export class TextFormDialog {

  private category: any;
  private createOrUpdate: boolean;
  private oldRoomName: any;
  private oldLocation: any;
  private room: Room;
  private roomName: any;
  private location: any;
  private message: any;
  private validationController: ValidationController;

  constructor(public controller: DialogController,
              private dialogService: DialogService,
              private controllerFactory: ValidationControllerFactory) {
    this.controller = controller;
    controller.settings.centerHorizontalOnly = true;
    this.validationController = controllerFactory.createForCurrentScope();
    this.validationController.validateTrigger = validateTrigger.manual;
  }

  activate(message: any) {
    if (!(typeof message === "string")) {
      this.createOrUpdate = true;
      this.room = new Room(message[1].name, message[1].category, message[1].location, message[1].key);
      this.oldRoomName = message[1].name;
      this.oldLocation = message[1].location;
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
      console.log(result);
      if(result.valid === true) {
        this.controller.ok(this.room);
      }
    });
  }
}

class Room {
  private roomName: any;
  private category: any;
  private location: any;
  private key: any;

  constructor(roomName: any, category: any, location: any) {
    this.roomName = roomName;
    this.category = category;
    this.location = location;
  }
}
