import {autoinject} from "aurelia-framework";
import {PeopleApi} from "../../api/group/people-api";

@autoinject
export class groupPage {
  private people: Person[];

  constructor(private peopleApi: PeopleApi) {
  }

  private getAllPeople() {
    this.peopleApi.getPeople().then(result => {
      console.log(result);
    });
  }
}


class Person {
  private _name: string;
  private _age: number;
  private _jobTitle: string;


  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get age(): number {
    return this._age;
  }

  set age(value: number) {
    this._age = value;
  }

  get jobTitle(): string {
    return this._jobTitle;
  }

  set jobTitle(value: string) {
    this._jobTitle = value;
  }
}
