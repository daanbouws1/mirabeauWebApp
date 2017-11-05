import {autoinject} from "aurelia-framework";
import {PeopleApi} from "../../api/group/people-api";
import {DialogService} from "aurelia-dialog";
import {DeleteDialog} from "../../widgets/dialog/delete/delete-dialog";
import {PersonFormDialog} from "../../widgets/dialog/file-upload/person-form-dialog";
import {Router} from 'aurelia-router';
import {Busy} from '../../widgets/spinner/busy';

@autoinject
export class groupPage {

  private people: Person[] = [];
  private storageRef: any;
  private storage: any;

  constructor(private peopleApi: PeopleApi,
              private dialogService: DialogService,
              private router: Router,
              private busy: Busy) {
  }

  activate() {
    let user = firebase.auth().currentUser;
    if (user) {
      this.getAllPeople();
      this.storage = firebase.storage();
    } else {
      this.router.navigate('login-page');
    }
  }


  private getAllPeople() {
    this.peopleApi.getPeople().then(result => {
      for(let item in result) {
        let age = result[item].userData.split(",")[0];
        let jobTitle = result[item].userData.split(",")[1];
        let id = result[item].personId;
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

  private editPerson(id: string) {  
    return this.peopleApi.getPerson(id).then(response => {
      console.warn("Die response", response);
    });
  }

  private deletePerson(dude: Person) {
    this.dialogService.open({
      viewModel: DeleteDialog,
      model: "Are you sure you want to delete this person?"
    }).whenClosed(response => {
      if (!response.wasCancelled) {
        this.peopleApi.deletePerson(dude._id).catch(() => {
        });
      }
    });
  }

  private addPerson() {
    this.dialogService.open({
        viewModel: PersonFormDialog,
        model: "Add a new person"
    }).whenClosed(response => {
      if(!response.wasCancelled) {

        this.storageRef = this.storage.ref(response.output.file.name);
        this.busy.on();
        this.storageRef.put(response.output.file).then(snapshot => {

          if(snapshot.state === "success") {
            let userData: string = response.output.age + ", " + response.output.jobTitle;
            let personData = {"name": response.output.name, "userData": userData};

            this.peopleApi.addPerson(JSON.stringify(personData)).then(result => {
              let newDude: Person = new Person(result.personId, response.output.name, response.output.age, response.output.jobTitle);
              this.people.push(newDude);
              let personFaceData = {"personId": result.personId, "url": snapshot.downloadURL};

              this.peopleApi.addPersonFace(JSON.stringify(personFaceData), result.personId).then(result => {
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

  private _id: string;
  private _name: string;
  private _age: string;
  private _jobTitle: string;

  constructor(id: string, name: string, age: string, jobTitle: string) {
    this._id = id;
    this._name = name;
    this._age = age;
    this._jobTitle = jobTitle;
  }


  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get age(): string {
    return this._age;
  }

  set age(value: string) {
    this._age = value;
  }

  get jobTitle(): string {
    return this._jobTitle;
  }

  set jobTitle(value: string) {
    this._jobTitle = value;
  }
}
