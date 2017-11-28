import {autoinject} from "aurelia-framework"
import {Router} from 'aurelia-router';
import {DeleteDialog} from "../../widgets/dialog/delete/delete-dialog";
import {DialogService} from "aurelia-dialog";
import {PeopleApi} from "../../api/group/people-api";
import {Busy} from '../../widgets/spinner/busy';


@autoinject
export class Nav {

  private currentUser: any;
  private storageRef: any;
  private storage: any;
  private user: any;

  constructor(private dialogService: DialogService,
              private peopleApi: PeopleApi,
              private router: Router,
              private busy: Busy) {
    this.user = firebase.auth().currentUser;
    firebase.database().ref("Companies/" + this.user.uid).once("value").then(result => {
      this.currentUser = result.val();
    });
    this.storage = firebase.storage();
  }

  private signUp() {
    this.router.navigate("signup");
  }

  private logout() {
    firebase.auth().signOut().then(result => {
      this.router.navigate("login-page");
    });
  }

  private openTextView() {
    this.router.navigate('text');
  }

  private openUserView() {
    this.router.navigate('home');
  }

  private deleteAccount() {
    this.dialogService.open({
      viewModel: DeleteDialog,
      model: "Are you sure you want to permanently delete your account?"
    }).whenClosed(result => {
      if (!result.wasCancelled) {
        this.busy.on();
        if (!(this.currentUser.role === "")) { //admin
          this.peopleApi.getPeople(this.currentUser.group).then(result => {
            for (let item of result) {
              for(let attr of item.persistedFaceIds) {
                this.peopleApi.getPersonFace(item.personId, attr, this.currentUser.group).then(response => {
                  //TODO delete firebase storage directory.
                  console.log(response);
                  this.storage.ref(response.userData).delete();
                });
              }
            }
          });
        } else {
          alert("cant delete original admin account");
        }
        this.busy.off();
        this.peopleApi.deleteGroup(this.currentUser.group);
        firebase.database().ref("Companies/" + this.user.uid).remove();
        this.user.delete();
      }
    })
  }
}










