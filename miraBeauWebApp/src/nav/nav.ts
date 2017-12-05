import {autoinject, bindable} from "aurelia-framework";
import {Router} from 'aurelia-router';
import {DialogService} from "aurelia-dialog";
import {DeleteDialog  } from "../widgets/dialog/delete/delete-dialog";

@autoinject
export class Nav {

  @bindable private navToggle: boolean;

  constructor(private router: Router,
              private dialogService: DialogService){
    this.checkUser();
  }

  bind() {
    console.log("1");
  }

  public checkUser() {
    this.user = firebase.auth().currentUser;
    if (!(this.user == null)) {
      firebase.database().ref("Companies/" + this.user.uid).once("value").then(result => {
          this.currentUser = result.val();
      });
      this.navToggle = true;
    } else {
      this.navToggle = false;
    }
    this.storage = firebase.storage();
  }

  private signUp() {
    this.router.navigate("signup");
  }

  private logout() {
    this.dialogService.open({
      viewModel: DeleteDialog,
      model: "Are you sure you want to change log-out?"
    }).whenClosed(result => {
      if (!result.wasCancelled) {
        firebase.auth().signOut().then(result => {
          this.checkUser();
          this.router.navigate("login-page");
        });
      }
    });
  }

  private openTextView() {
    this.router.navigate('text');
  }

  private openUserView() {
    this.router.navigate('home');
  }

  private sendChangePasswordEmail() {
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
                  this.storage.ref(response.userData).delete();
                });
              }
            }
          });
        } else {
          alert("cant delete original admin account");
        }
        this.peopleApi.deleteGroup(this.currentUser.group);
        firebase.database().ref("Companies/" + this.user.uid).remove();
        this.user.delete();
        this.busy.off();
        this.logout();
      }
    })
  }
}
