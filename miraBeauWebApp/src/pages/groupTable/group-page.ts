import {autoinject} from "aurelia-framework";
import {PeopleApi} from "../../api/group/people-api";
import {DialogService} from "aurelia-dialog";
import {DeleteDialog} from "../../widgets/dialog/delete/delete-dialog";
import {PersonFormDialog} from "../../widgets/dialog/file-upload/person-form-dialog";
import {Router} from 'aurelia-router';

@autoinject
export class groupPage {

  private people: Person[] = [];
  private storageRef: any;
  private storage: any;

  constructor(private peopleApi: PeopleApi,
              private dialogService: DialogService,
              private router: Router) {
  }

  activate() {
    let user = firebase.auth().currentUser;
    console.log(user);
    if (!(user == null)) {
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
      console.log(result);
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
    this.dialogService.open({
        viewModel: PersonFormDialog,
        model: "Add a new person"
    }).whenClosed(response => {
      if(!response.wasCancelled) {
        let userData: string = response.output.age + ", " + response.output.jobTitle;
        let personData = {"name": response.output.name, "userData": userData};
        console.log(JSON.stringify(personData));
        // personData = <JSON>personData;

        this.peopleApi.addPerson(JSON.stringify(personData)).then(result => {
          console.log(result);
          // this.storageRef = this.storage.ref(response.output.file.name);
          // this.addPersonFace(result.personId, response.output.file);
        });
      }
    })
  }

  private addPersonFace(personId: any, file: any) {
    let formDataFace: FormData = new FormData();
    this.storageRef.put(file).then(snapshot => {
      console.log(snapshot);
      console.log('Uploaded a blob or file!');
      if(snapshot.success) {
        formDataFace.append("url", snapshot.downloadUrl);
        this.peopleApi.addPersonFace(formDataFace, personId).then(result => {
          console.log(result);
        });
      }
    });
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
