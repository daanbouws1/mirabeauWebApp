import {autoinject} from "aurelia-framework";
import {DialogController} from "aurelia-dialog";
import {PeopleApi} from "../../../api/group/people-api";

@autoinject
export class PictureManager {

  private storageRef: any;
  private personPictureUrls: any[];
  private personPictureReferences: any[];
  private personId: string;
  private hasFocus: boolean;

  constructor(private peopleApi: PeopleApi,
              public controller: DialogController){
    this.controller = controller;
    controller.settings.centerHorizontalOnly = true;
    this.storageRef = firebase.storage().ref();
    this.myKeypressCallback = this.keypressInput.bind(this);
  }

  activate(message){
    this.personId = message;
    this.getPictureData();
    window.addEventListener('keypress', this.myKeypressCallback, false);
    this.hasFocus = true;
  }

  deactivate() {
    window.removeEventListener('keypress', this.myKeypressCallback);
  }

  private keypressInput(e) {
    if (e.code === "Enter") {
      this.controller.ok();
    }
  }

  private getPictureData() {
    this.personPictureUrls = [];
    this.personPictureReferences = [];
    this.peopleApi.getPerson(this.personId).then(result => {
      console.log(result);
      for(const item of result.persistedFaceIds) {
        this.peopleApi.getPersonFace(this.personId, item).then(result => {
          this.storageRef.child(result.userData).getDownloadURL().then(url => {
            this.personPictureUrls.push(url);
            this.personPictureReferences.push(result.userData);
          }).catch(error => {
            console.log(error);
          });
        });
      }
    });
  }

  private deletePic(pic: any) {
    let index = this.personPictureUrls.indexOf(pic);
    const firebaseImageRef = this.personPictureReferences[index];
    this.peopleApi.getPerson(this.personId).then(result => {
      for (const item of result.persistedFaceIds) {
        this.peopleApi.getPersonFace(this.personId, item).then(response => {
          if (response.userData == firebaseImageRef) {
            this.peopleApi.deletePersonFace(this.personId, item).then(() => {
              this.storageRef.child(firebaseImageRef).delete();
              this.getPictureData();
            });
          }
        });
      }
    });
  }
}
