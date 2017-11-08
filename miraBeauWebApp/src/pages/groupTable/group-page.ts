import {autoinject} from "aurelia-framework";
import {PeopleApi} from "../../api/group/people-api";
import {DialogService} from "aurelia-dialog";
import {DeleteDialog} from "../../widgets/dialog/delete/delete-dialog";
import {PersonFormDialog} from "../../widgets/dialog/file-upload/person-form-dialog";
import {Router} from 'aurelia-router';
import {Busy} from '../../widgets/spinner/busy';

@autoinject
export class groupPage {

  private people: Person[];
  private storageRef: any;
  private storage: any;

  constructor(private peopleApi: PeopleApi,
              private dialogService: DialogService,
              private router: Router,
              private busy: Busy) {
  }

  activate() {
    let user: any = firebase.auth().currentUser;
    if (user) {
      this.getAllPeople();
      this.storage = firebase.storage();
    } else {
      this.router.navigate('login-page');
    }
  }


  private getAllPeople() {
    this.people = [];
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
    firebase.auth().signOut().then(result => {
      this.router.navigate("login-page");
    });
  }

  private editPerson(dude: Person) {
    return this.peopleApi.getPerson(dude.id).then(response => {
      this.dialogService.open({
        viewModel: PersonFormDialog,
        model: ["Add a new person", dude]
      }).whenClosed(response => {
        if(!response.wasCancelled) {
          let userData: string = response.output.age + "," + response.output.jobTitle;
          let personData: any = {"name": response.output.name, "userData": userData};
          this.peopleApi.updatePerson(JSON.stringify(personData), response.output.id).catch(() => {
            this.getAllPeople();
          });

          if (!(response.output.file == null)) {
            this.storageRef = this.storage.ref(response.output.file.name);
            this.busy.on();
            this.storageRef.put(response.output.file).then(() => {
              this.busy.off();
            });
          }
        }
      });
    });
  }

  private deletePerson(dude: Person) {
    this.dialogService.open({
      viewModel: DeleteDialog,
      model: "Are you sure you want to delete this person?"
    }).whenClosed(response => {
      if (!response.wasCancelled) {
        this.peopleApi.deletePerson(dude.id).catch(() => {
          this.getAllPeople();
        });
      }
    });
  }

  private addPerson() {
    this.dialogService.open({
        viewModel: PersonFormDialog,
        model: "Add a new person",
    }).whenClosed(response => {
      if(!response.wasCancelled) {

        this.storageRef = this.storage.ref(response.output.file.name);
        this.busy.on();
        this.storageRef.put(response.output.file).then(snapshot => {

          if(snapshot.state === "success") {
            let userData: string = response.output.age + ", " + response.output.jobTitle;
            let personData: any = {"name": response.output.name, "userData": userData};

            this.peopleApi.addPerson(JSON.stringify(personData)).then(result => {
              let newDude: Person = new Person(result.personId, response.output.name, response.output.age, response.output.jobTitle);
              this.people.push(newDude);
              let personFaceData = {"personId": result.personId, "url": snapshot.downloadURL};

              this.peopleApi.addPersonFace(JSON.stringify(personFaceData), result.personId).then(() => {
                this.peopleApi.trainGroup();
                this.busy.off();
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
