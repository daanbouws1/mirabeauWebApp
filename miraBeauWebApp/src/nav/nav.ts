import {autoinject, bindable, Aurelia} from "aurelia-framework";
import {Router} from 'aurelia-router';
import {DialogService} from "aurelia-dialog";
import {DeleteDialog} from "../widgets/dialog/delete/delete-dialog";
import {Busy} from '../widgets/spinner/busy';
import {PeopleApi} from "../api/group/people-api";

@autoinject
export class Nav {

  @bindable private navToggle: boolean;
  private isSelected: string;
  private user: any;
  private currentUser: any;
  private storage: any;
  private company: any;

  constructor(private router: Router,
              private dialogService: DialogService,
              private busy: Busy,
              private aurelia: Aurelia,
              private peopleApi: PeopleApi){
    this.checkUser();
  }

  activate() {}

  public checkUser() {
    this.user = firebase.auth().currentUser;
    if (!(this.user == null)) {
      firebase.database().ref("Users/" + this.user.uid)
        .once("value").then(result => {
          this.company = result.val().name;
        firebase.database().ref("Companies/" + this.company + "/" + this.user.uid)
          .once("value").then(result => {
          this.currentUser = result.val();
        });
      });
      this.navToggle = true;
    } else {
      this.navToggle = false;
    }
    this.storage = firebase.storage();
  }

  private callcounter() {
    this.isSelected = 'calls';
    this.router.navigate('calls');
  }

  private signUp() {
    this.isSelected = "signup";
    this.router.navigate("signup");
  }

  private logout() {
    this.isSelected = "logout";
    this.dialogService.open({
      viewModel: DeleteDialog,
      model: "Are you sure you want to change log-out?"
    }).whenClosed(result => {
      if (!result.wasCancelled) {
        firebase.auth().signOut().then(result => {
          this.checkUser();
          this.aurelia.setRoot('login-router');
          this.router.navigate("login-page");
        });
      }
    });
  }

  private openTextView() {
    this.isSelected = "room";
    this.router.navigate('text');
  }

  private openUserView() {
    this.isSelected = "client";
    this.router.navigate('home');
  }

  private sendChangePasswordEmail() {
    this.isSelected = "reset";
    this.dialogService.open({
      viewModel: DeleteDialog,
      model: "Are you sure you want to change your password? if so a link to do so is being send by email"
    }).whenClosed(result => {
      if (!result.wasCancelled) {
        firebase.auth().sendPasswordResetEmail(this.user.email);
        alert("check your email, as change password mail has been sent.");
      }
    });
  }

  private deleteAccount() {
    this.isSelected = "delete";
    this.dialogService.open({
      viewModel: DeleteDialog,
      model: "Are you sure you want to permanently delete your account?"
    }).whenClosed(result => {
      if (!result.wasCancelled) {
        this.busy.on();
        if (!(this.currentUser.role === "admin")) {
          this.peopleApi.getPeople(this.currentUser.group).then(result => {
            for (let item of result) {
              for(let attr of item.persistedFaceIds) {
                this.peopleApi.getPersonFace(item.personId, attr, this.currentUser.group).then(response => {
                  firebase.storage.ref(response.userData).delete();
                });
              }
            }
          });
        } else {
          alert("cant delete original admin account");
        }
        this.peopleApi.deleteGroup(this.currentUser.group);
        firebase.database().ref("Companies/" + this.company + "/" + this.user.uid).remove();
        firebase.database().ref("Users/" + this.user.uid).remove();
        this.user.delete();
        this.busy.off();
        this.logout();
      }
    })
  }
}
