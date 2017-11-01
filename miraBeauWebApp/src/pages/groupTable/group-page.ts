import {autoinject} from "aurelia-framework";
import {PeopleApi} from "../../api/group/people-api";
import {DialogService} from "aurelia-dialog";

@autoinject
export class groupPage {
  private people: Person[] = [];

  constructor(private peopleApi: PeopleApi,
              private dialogService: DialogService) {
  }

  activate() {
    this.getAllPeople();
  }

  private getAllPeople() {
    this.peopleApi.getPeople().then(result => {
      for(let item in result) {
        let age = result[item].userData.split(",")[0];
        let jobTitle = result[item].userData.split(",")[1];
        let guy: Person = new Person(result[item].name,age,jobTitle);
        this.people.push(guy);
      }
    });
  }

  private editPerson(dude: Person) {
    console.log("open a modal and edit this dewd " + dude.name);
  }

  private deletePerson(dude: Person) {
    console.log("delete this duuwwduru " + dude.name);
    this.dialogService.open()
  }

  private addPerson() {
    console.log("add a dewd");
  }
}


class Person {
  private _name: string;
  private _age: string;
  private _jobTitle: string;

  constructor(name: string, age: string, jobTitle: string) {
    this._name = name;
    this._age = age;
    this._jobTitle = jobTitle;
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
