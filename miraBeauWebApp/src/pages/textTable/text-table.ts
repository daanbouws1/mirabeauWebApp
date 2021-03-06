import {autoinject} from "aurelia-framework";
import {DialogService} from "aurelia-dialog";
import {TextFormDialog} from "../../widgets/dialog/text-upload/text-form-dialog"
import {DeleteDialog} from "../../widgets/dialog/delete/delete-dialog";

@autoinject
export class textTable {

  private rooms: ConferenceRoom[];
  private newlyAdded: boolean;
  private user: any;
  private company: any;

  constructor(private dialogService: DialogService){}

  activate() {
    this.newlyAdded = false;
    this.user = firebase.auth().currentUser;
    firebase.database().ref("Users/" + this.user.uid).once('value').then(result => {
      this.company = result.val().name;
      this.getRooms();
    });
  }

  private getRooms() {
    this.rooms = [];
    firebase.database().ref("Companies/" + this.company + "/" + this.user.uid + "/rooms").once('value').then(result => {
      // pls don't ask.
      let resultArray = Object.keys(result.val()).map(roomIndex => {
        return result.val()[roomIndex];
      });
      // fill array for ui.
      for (let item of resultArray) {
        let conferenceRoom: ConferenceRoom = new ConferenceRoom(item.name, item.type, item.location, item.key);
        this.rooms.push(conferenceRoom);
      }
    });
  }

  private filterFunc(searchTerm, room) {
    //search on name and location.
    return room.name.toUpperCase().indexOf(searchTerm.toUpperCase()) !== -1 ||
      room.location.toUpperCase().lastIndexOf(searchTerm.toUpperCase()) !== -1;
  }

  private addNewText() {
    this.dialogService.open({
      viewModel: TextFormDialog,
      model: "Add a new room to recognize"
    }).whenClosed(result => {
      if(!(result.wasCancelled)) {
        let database = firebase.database();
        // add new room to firebase.
        firebase.database().ref("Companies/" + this.company + "/" + this.user.uid+ "/rooms/" + result.output.roomName + "-" + result.output.location).set({
          name: result.output.roomName,
          uppername: result.output.roomName.toUpperCase(),
          type: result.output.category,
          location: result.output.location,
          key: result.output.roomName + "-" + result.output.location
        }).then(() => {
          let conferenceRoom: ConferenceRoom = new ConferenceRoom(result.output.roomName, result.output.category,
            result.output.location, result.output.roomName + "-" + result.output.location);
          this.rooms.unshift(conferenceRoom);
          this.newlyAdded = true;
        });
      }
    });
  }

  private editRoom(room: any) {
    this.dialogService.open({
      viewModel: TextFormDialog,
      model: ["Update this room's data", room]
    }).whenClosed(result => {
      if(!(result.wasCancelled)) {
        firebase.database().ref("Companies/" + this.company + "/" + this.user.uid+ "/rooms/" + room.key).update({
          name: result.output.roomName,
          uppername: result.output.roomName.toUpperCase(),
          type: result.output.category,
          location: result.output.location,
          key: result.output.key
        }).then(() => {
          let conferenceRoom: ConferenceRoom = new ConferenceRoom(result.output.roomName,
            result.output.category, result.output.location, result.output.key);
          let index = this.rooms.indexOf(room);
          this.rooms.splice(index,1);
          this.rooms.unshift(conferenceRoom);
          this.newlyAdded = true;
        }).catch(error => {
          console.log(error);
        });
      }
    });
  }

  private deleteRoom(room: any) {
    this.dialogService.open({
      viewModel: DeleteDialog,
      model: "are you sure you want to delete this room?"
    }).whenClosed(result => {
      if (!(result.wasCancelled)) {
        firebase.database().ref("Companies/" + this.company + "/" + this.user.uid+ "/rooms").child(room.key).remove().catch(error => {
          //still waiting for this one.
          console.log(error);
        });
        this.newlyAdded = false;
        this.getRooms();
      }
    })
  }
}

class ConferenceRoom {
  public name: string;
  public category: any;
  public location: string;
  public key: string;


  constructor(name: string, category: any, location: string, key: string) {
    this.name = name;
    this.category = category;
    this.location = location;
    this.key = key;
  }
}
