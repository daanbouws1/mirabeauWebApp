import {autoinject} from "aurelia-framework";
import {Router} from 'aurelia-router';
import {DialogService} from "aurelia-dialog";
import {TextFormDialog} from "../../widgets/dialog/text-upload/text-form-dialog"
import {DeleteDialog} from "../../widgets/dialog/delete/delete-dialog";

@autoinject
export class TextTable {

  private rooms: ConferenceRoom[] = [];
  private newlyAdded: boolean;

  constructor(private router: Router,
              private dialogService: DialogService
  ){}

  activate() {
    let database = firebase.database();
    this.newlyAdded = false;
    this.getRooms();
  }

  private getRooms() {
    this.rooms = [];
    firebase.database().ref("rooms").once("value").then(result => {
      let resultArray = Object.keys(result.val()).map(function(roomIndex){
        return result.val()[roomIndex];
      });
      for (let item of resultArray) {
        let conferenceRoom: ConferenceRoom = new ConferenceRoom(item.name, item.type, item.location, item.key);
        this.rooms.push(conferenceRoom);
      }
    });
  }

  private openUserView() {
    this.router.navigate('home');
  }

  private logout() {
    //logout
    firebase.auth().signOut().then(result => {
      this.router.navigate("login-page");
    });
  }

  private filterFunc(searchTerm, room) {
    return room.name.toUpperCase().indexOf(searchTerm.toUpperCase()) !== -1;
  }

  private addNewText() {
    this.dialogService.open({
      viewModel: TextFormDialog,
      model: "Add a new room to recognize"
    }).whenClosed(result => {
      if(!(result.wasCancelled)) {
        let database = firebase.database();
        firebase.database().ref("rooms/" + result.output.roomName + "-" + result.output.location).set({
          name: result.output.roomName,
          type: result.output.category,
          location: result.output.location,
          key: result.output.roomName + "-" + result.output.location
        }).then(() => {
          let conferenceRoom: ConferenceRoom = new ConferenceRoom(result.output.roomName,
            result.output.category, result.output.location, result.output.key);
          this.rooms.unshift(conferenceRoom);
          this.newlyAdded = true;
        }).catch(result => {
          console.log(result);
        });
      }
    })
  }

  private editRoom(room: any) {
    console.log(room);
    this.dialogService.open({
      viewModel: TextFormDialog,
      model: ["Update this room's data", room]
    }).whenClosed(result => {
      if(!(result.wasCancelled)) {
        firebase.database().ref("rooms/" + room.key).update({
          name: result.output.roomName,
          type: result.output.category,
          location: result.output.location,
          key: room.key
        }).then(() => {
          // this.getRooms();
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
        firebase.database().ref("rooms").child(room.key).remove().catch(error => {
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
