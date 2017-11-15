import {autoinject} from "aurelia-framework";
import {Router} from 'aurelia-router';
import {DialogService} from "aurelia-dialog";
import {TextFormDialog} from "../../widgets/dialog/text-upload/text-form-dialog"
import {DeleteDialog} from "../../widgets/dialog/delete/delete-dialog";

@autoinject
export class TextTable {

  private rooms: ConferenceRoom[] = [];
  private newlyAdded: boolean = false;

  constructor(private router: Router,
              private dialogService: DialogService
  ){}

  activate() {
    let database = firebase.database();
    firebase.database().ref("rooms").once("value").then(result => {
      var resultArray = Object.keys(result.val()).map(function(roomIndex){
        var room = result.val()[roomIndex];
        // do something with room
        return room;
      });
      for (let item of resultArray) {
        let conferenceRoom: ConferenceRoom = new ConferenceRoom(item.name, item.type, item.location);
        this.rooms.push(conferenceRoom);
      }
      console.log(this.rooms[0]);
    });
  }

  private openUserView() {
    this.router.navigate('home');
  }

  private addNewText() {
    this.dialogService.open({
      viewModel: TextFormDialog,
      model: "Add a new room to recognize"
    }).whenClosed(result => {
      if(!(result.wasCancelled)) {
        console.log(result);
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
        console.log(result);
      }
    })
  }

  private deleteRoom(room: any) {
    console.log(room);
    this.dialogService.open({
      viewModel: DeleteDialog,
      model: "are you sure you want to delete this room?"
    }).whenClosed(result => {
      if (!(result.wasCancelled)) {
        console.log(result);
        firebase.database().ref("rooms/" + room.name + "2-" + room.location).remove().then(error => {
          console.log(error);
        })
      }
    })
  }
}


class ConferenceRoom {
  public name: string;
  public category: any;
  public location: string;


  constructor(name: string, category: any, location: string) {
    this.name = name;
    this.category = category;
    this.location = location;
  }
}
