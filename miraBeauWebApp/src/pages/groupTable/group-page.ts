import {autoinject} from "aurelia-framework";
import {PeopleApi} from "../../api/group/people-api";
import {DialogService} from "aurelia-dialog";
import {DeleteDialog} from "../../widgets/dialog/delete/delete-dialog";
import {PersonFormDialog} from "../../widgets/dialog/file-upload/person-form-dialog";
import {Router} from 'aurelia-router';
import {Busy} from '../../widgets/spinner/busy';
import {InvalidImageDialog} from "../../widgets/dialog/invalid-image/invalid-image-dialog";

@autoinject
export class groupPage {

  private people: Person[];
  private storageRef: any;
  private storage: any;
  private newlyAdded: boolean;

  constructor(private peopleApi: PeopleApi,
              private dialogService: DialogService,
              private router: Router,
              private busy: Busy) {
  }

  activate() {
    // check if user really is logged in and redirect if not.
    let user: any = firebase.auth().currentUser;
    if (user) {
      // this.newlyAdded = false;
      this.getAllPeople();
      this.storage = firebase.storage();
    } else {
      this.router.navigate('login-page');
    }
  }


  private getAllPeople() {
    this.people = [];
    //get list of people in group from azure
    this.peopleApi.getPeople().then(result => {
      for(let item in result) {
        let age: string = result[item].userData.split(",")[0];
        let jobTitle: string = result[item].userData.split(",")[1];
        let id: string = result[item].personId;
        let guy: Person = new Person(id, result[item].name, age, jobTitle);
        this.people.push(guy);
      }
    });
  }

  private logout() {
    //logout
    firebase.auth().signOut().then(result => {
      this.router.navigate("login-page");
    });
  }

  private editPerson(dude: Person) {
    //Get data person form azure.
    return this.peopleApi.getPerson(dude.id).then(result => {
      let personId = result.personId;
      // Open Edit Dialog with person data.
      this.dialogService.open({
        viewModel: PersonFormDialog,
        model: ["Add a new person", dude]
      }).whenClosed(response => {
        //Check if user clicked ok
        if(!response.wasCancelled) {
          let userData: string = response.output.age + "," + response.output.jobTitle;
          let personData: any = {"name": response.output.name, "userData": userData};
          //Update persondata in azure
          this.peopleApi.updatePerson(JSON.stringify(personData), response.output.id).catch(() => {
            this.getAllPeople();
          });
          // Check if file was provided
          if (!(response.output.file == null)) {
            this.storageRef = this.storage.ref(response.output.file.name);
            this.busy.on();
            //Upload file to firebase
            this.storageRef.put(response.output.file).then(response => {
              let faceData: any = {"personId": personId, "url": response.downloadURL};
              // Upload url to file to Azure to add the face to a person.
              this.peopleApi.addPersonFace(JSON.stringify(faceData), personId).then(result => {
                this.peopleApi.trainGroup();
                this.busy.off();
              }).catch(() => {
                // Giving user feedback he/she has uploaded a invalid image
                this.invalidImageResponse();
              });
            });
          }
        }
      });
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

  private deletePerson(dude: Person) {
    this.dialogService.open({
      viewModel: DeleteDialog,
      model: "Are you sure you want to delete this person?"
    }).whenClosed(response => {
      // if (!response.wasCancelled) {
      //   this.peopleApi.getPerson(dude.id).then(result => {
      //     console.log(result.persistedFaceIds);
      //   });
        //Delete person from azure.
        this.peopleApi.deletePerson(dude.id).catch(() => {
          this.getAllPeople();
          this.newlyAdded = false;
        });
      // }
    });
  }

  private addPerson() {
    //Open Add Person Dialog
    this.dialogService.open({
        viewModel: PersonFormDialog,
        model: "Add a new person",
    }).whenClosed(response => {
      //Check if user clicked ok.
      if(!response.wasCancelled) {
        this.storageRef = this.storage.ref(response.output.file.name);
        this.busy.on();
        //Upload file to firebase
        this.storageRef.put(response.output.file).then(snapshot => {
          //Check if file uploaded successfully
          if(snapshot.state === "success") {
            let userData: string = response.output.age + ", " + response.output.jobTitle;
            let personData: any = {"name": response.output.name, "userData": userData};
            // Upload new person to azure
            this.peopleApi.addPerson(JSON.stringify(personData)).then(result => {
              let newDude: Person = new Person(result.personId, response.output.name, response.output.age, response.output.jobTitle);
              this.people.unshift(newDude);
              this.newlyAdded = true;
              let personFaceData = {"personId": result.personId, "url": snapshot.downloadURL};
              // Add a reference to image in firebase to a person and call it their face.
              this.peopleApi.addPersonFace(JSON.stringify(personFaceData), result.personId).then(() => {
                this.peopleApi.trainGroup();
                this.busy.off();
              }).catch(() => {
                // Giving user feedback he/she has uploaded a invalid image
                this.invalidImageResponse();
              });
            });
          }
        });
      }
    })
  }

}

class Person {

  public id: string;
  public name: string;
  public age: string;
  public jobTitle: string;

  constructor(id: string, name: string, age: string, jobTitle: string) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.jobTitle = jobTitle;
  }
}
