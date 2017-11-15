import {autoinject} from "aurelia-framework";
import {DialogController} from "aurelia-dialog";
import {DialogService} from "aurelia-dialog";

@autoinject(DialogController)

@autoinject
export class TextFormDialog {

  private category: any;
  private createOrUpdate: boolean;
  private oldRoomName: any;
  private roomName: any;
  private location: any;
  private message: any;

  constructor(public controller: DialogController,
              private dialogService: DialogService) {
    this.controller = controller;
    controller.settings.centerHorizontalOnly = true;
    this.category = "Conference Room"
  }

  activate(message: any) {
    if (!(typeof message === "string")) {
      this.createOrUpdate = true;
      console.log("1", message[1]);
      this.roomName = message[1].name;
      this.oldRoomName = message[1].name;
      this.location = message[1].location;
    } else {
      this.createOrUpdate = false;
      this.message = message;
    }
  }

  private updateConference() {
    firebase.database().ref("rooms/" + this.oldRoomName + "-" + this.location).update({
      name: this.roomName,
      type: this.category,
      location: this.location
    }).catch(error => {
      console.log(error);
    });
  }

  private addConference() {
    let database = firebase.database();
    firebase.database().ref("rooms/" + this.roomName + "-" + this.location).set({
      name: this.roomName,
      type: this.category,
      location: this.location
    }).catch(result => {
      console.log(result);
    });
  }
}
