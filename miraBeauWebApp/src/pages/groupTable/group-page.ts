import {autoinject} from "aurelia-framework";
import {PeopleApi} from "../../api/group/people-api";
import {DialogService} from "aurelia-dialog";
import {DeleteDialog} from "../../widgets/dialog/delete/delete-dialog";
import {PersonFormDialog} from "../../widgets/dialog/file-upload/person-form-dialog";

@autoinject
export class groupPage {

  private people: Person[] = [];

  constructor(private peopleApi: PeopleApi,
              private dialogService: DialogService) {
  }

  activate() {
    this.getAllPeople();
    var storage = firebase.storage();
    var storageRef = storage.ref();
    console.log(storage);
    console.log(storageRef);
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

  private editPerson(id: string) {  
    return this.peopleApi.getPerson(id).then(response => {
      console.warn("Die response", response);
    });
  }

  private deletePerson(dude: Person) {
    console.log("delete this duuwwduru " + dude.name);
    this.dialogService.open({
      viewModel: DeleteDialog,
      model: "Are you sure you want to delete this person?"
    }).whenClosed(response => {
      if (!response.wasCancelled) {
        console.log("delete the mothafucktard");
      }
    });
  }

  private addPerson() {
    console.log("add a dewd");
    this.dialogService.open({
        viewModel: PersonFormDialog,
        model: "Add a new person"
    }).whenClosed(response => {
      if(!response.wasCancelled) {
        console.log("DIE RESPONSE",response);
        // TODO send picture to firebase, recieve link back from firebase.
        // TODO send personData to Azure along with link to image on firebase.
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
