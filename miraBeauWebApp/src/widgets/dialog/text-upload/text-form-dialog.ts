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
  private room: Room = new Room();
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
    this.room.category = "Conference Room";
  }

  activate(message: any) {
    if (!(typeof message === "string")) {
      this.createOrUpdate = true;
      this.room.roomName = message[1].name;
      this.oldRoomName = message[1].name;
      this.oldLocation = message[1].location;
      this.room.location = message[1].location;
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
        let room: Room = new Room(this.room.roomName, this.room.category, this.room.location);
        this.controller.ok(room);
      }
    });
  }
}

class Room {
  private roomName: any;
  private category: any;
  private location: any;

  constructor(roomName: any, category: any, location: any) {
    this.roomName = roomName;
    this.category = category;
    this.location = location;
  }
}
