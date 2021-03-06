import {autoinject} from "aurelia-framework";
import {PeopleApi} from "../../api/group/people-api";
import {DialogService} from "aurelia-dialog";
import {DeleteDialog} from "../../widgets/dialog/delete/delete-dialog";
import {PersonFormDialog} from "../../widgets/dialog/file-upload/person-form-dialog";
import {Busy} from '../../widgets/spinner/busy';
import {Router} from "aurelia-router";
import {InvalidImageDialog} from "../../widgets/dialog/invalid-image/invalid-image-dialog";

@autoinject
export class groupPage {

  private people: Person[];
  private storageRef: any;
  private storage: any;
  private newlyAdded: boolean;
  private currentUser: any;
  private company: any;

  constructor(private peopleApi: PeopleApi,
              private dialogService: DialogService,
              private router: Router,
              private busy: Busy) {
  }

  activate() {
    // check if user really is logged in and redirect if not.
    let user: any = firebase.auth().currentUser;
    if (user) {
      firebase.database().ref("Users/" + user.uid).once("value").then(result => {
        this.company = result.val().name;
        this.newlyAdded = false;
        this.getAllPeople();
        this.storage = firebase.storage();
      });
    } else {
      this.router.navigate('login-page');
    }
  }

  private getAllPeople() {
    this.people = [];
    //get list of people in group from azure
    let user: any = firebase.auth().currentUser;
    firebase.database().ref("Companies/" + this.company + "/" + user.uid).once("value").then(result => {
      this.currentUser = result.val();
      this.peopleApi.getPeople(this.currentUser.group).then(result => {
        // fill array of people
        result.map(item => {
          let age: string = item.userData.split(",")[0];
          let jobTitle: string = item.userData.split(",")[1];
          let id: string = item.personId;
          let message: string = item.userData.split(",")[2];
          let guy: Person = new Person(id, item.name, age, jobTitle, message);
          this.people.push(guy);
        });
      });
    });
  }

  private filterFunc(searchTerm, person) {
    return person.name.toUpperCase().indexOf(searchTerm.toUpperCase()) !== -1;
  }

  private editPerson(dude: Person) {
    //Get data person form azure.
    return this.peopleApi.getPerson(dude.id, this.currentUser.group).then(result => {
      let personId = result.personId;
      // Open Edit Dialog with person data.
      this.dialogService.open({
        viewModel: PersonFormDialog,
        model: ["Add a new person", dude]
      }).whenClosed(response => {
        //Check if user clicked ok
        if(!response.wasCancelled) {
          let userData: string = response.output.age + "," + response.output.jobTitle + "," + response.output.message;
          let personData: any = {"name": response.output.name, "userData": userData};
          //Update persondata in azure
          this.peopleApi.updatePerson(JSON.stringify(personData), dude.id, this.currentUser.group).then(() => {
            let index = this.people.indexOf(dude);
            this.people.splice(index,1);
            this.updatePersonCallback(dude.id);
          });
          // Check if file was provided
          if (!(response.output.file == null)) {
            this.updateFace(response.output.file, personId);
          }
        }
      });
    });
  }

  private deletePerson(dude: Person) {
    this.dialogService.open({
      viewModel: DeleteDialog,
      model: "Are you sure you want to delete this person?"
    }).whenClosed(result => {
      if (!result.wasCancelled) {
        //get person from azure.
        this.peopleApi.getPerson(dude.id, this.currentUser.group).then(result => {
          for (let item of result.persistedFaceIds) {
            // delete all pictures related to person retrieved from azure from firebase.
            this.peopleApi.getPersonFace(dude.id, item, this.currentUser.group).then(result => {
              this.storageRef = this.storage.ref(result.userData);
              this.storageRef.delete();
            });
          }
          // delete person from azure.
          this.peopleApi.deletePerson(dude.id, this.currentUser.group).then(() => {
            this.newlyAdded = false;
            this.getAllPeople();
          });
        });
      }
    });
  }

  private addPerson() {
    //Open Add Person Dialog
    this.dialogService.open({
        viewModel: PersonFormDialog,
        model: "Add a new person",
    }).whenClosed(response => {
      //Check if user clicked ok.
      if (!response.wasCancelled) {
        this.storageRef = this.storage.ref(this.currentUser.name + "/" + response.output.file.name);
        this.busy.on();
        //Upload file to firebase
        this.storageRef.put(response.output.file).then(snapshot => {
          //Check if file uploaded successfully
          if (snapshot.state === "success") {
            this.addFace(response, snapshot.downloadURL);
          }
        });
      }
    });
  }

  private updateFace(file: any, id: any) {
    this.storageRef = this.storage.ref(this.currentUser.name + "/" + file.name);
    this.busy.on();
    //Upload file to firebase
    this.storageRef.put(file).then(response => {
      let filepath = this.storageRef.fullPath;
      let faceData: any = {"personId": id, "url": response.downloadURL};
      // Upload url to file to Azure to add the face to a person.
      this.peopleApi.addPersonFace(JSON.stringify(faceData), id, this.currentUser.group).then(result2 => {
        this.PersonFaceCallBack(id, result2.persistedFaceId);
      }).catch(error => {
        // Giving user feedback he/she has uploaded a invalid image
        console.log(error);
        this.invalidImageResponse();
      });
    });
  }

  private addFace(response: any, url: any) {
    //get data to be uploaded from response
    let userData: string = response.output.age + ", " + response.output.jobTitle + "," + response.output.message;
    let personData: any = {"name": response.output.name, "userData": userData};
    // Upload new person to azure
    this.peopleApi.addPerson(JSON.stringify(personData), this.currentUser.group).then(result => {
      let newDude: Person = new Person(result.personId, response.output.name, response.output.age, response.output.jobTitle, response.output.message);
      this.updateTableAfterAdd(newDude);
      let personFaceData = {"personId": result.personId, "url": url};
      // Add a reference to image in firebase to a person and call it their face.
      this.peopleApi.addPersonFace(JSON.stringify(personFaceData), result.personId, this.currentUser.group).then(result2 => {
        this.PersonFaceCallBack(result.personId, result2.persistedFaceId);
      }).catch(error => {
        // Giving user feedback he/she has uploaded a invalid image
        if (error.code) {
          this.invalidImageResponse();
        }
      });
    });
  }

  private updateTableAfterAdd(dude: Person) {
    this.people.unshift(dude);
    this.newlyAdded = true;
  }

  private PersonFaceCallBack(id:string, faceId: string) {
    let filepath = this.storageRef.fullPath;
    let personFaceUserData = {"userData": filepath};
    this.peopleApi.updatePersonFace(JSON.stringify(personFaceUserData), id, faceId, this.currentUser.group).catch(result => {
      alert(result.message + "  AZURE STILL TRAINING, TRY AGAIN");
    });
    this.peopleApi.trainGroup(this.currentUser.group).then(() => {
      this.busy.off();
    });
  }

  private invalidImageResponse() {
    //Give user feedback they have uploaded a invalid image
    this.busy.off();
    this.dialogService.open({
      viewModel: InvalidImageDialog,
      model: "According to azure that file is not valid, probably there are multiple faces in it."
    }).whenClosed(() => {
      this.busy.on();
      this.storageRef.delete();
      this.busy.off();
    });
  }

  private updatePersonCallback(id: any) {
    this.peopleApi.getPerson(id, this.currentUser.group).then(result => {
      let age: string = result.userData.split(",")[0];
      let jobTitle: string = result.userData.split(",")[1];
      let message: string = result.userData.split(",")[2];
      let edittedDude: Person = new Person(id, result.name, age, jobTitle, message);
      this.updateTableAfterAdd(edittedDude);
    });
  }
}

class Person {

  public id: string;
  public name: string;
  public age: string;
  public jobTitle: string;
  public message: string;

  constructor(id: string, name: string, age: string, jobTitle: string, message: string) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.jobTitle = jobTitle;
    this.message = message;
  }
}
