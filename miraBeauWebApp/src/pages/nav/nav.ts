import {autoinject} from "aurelia-framework"
import {Router} from 'aurelia-router';

@autoinject
export class Nav {

  private currentUser: any;

  constructor(private router: Router) {
    let user: any = firebase.auth().currentUser;
    firebase.database().ref("Companies/" + user.uid).once("value").then(result => {
      this.currentUser = result.val();
    });

  }

  activate() {

  }

  private signUp() {
    this.router.navigate("signup");
  }

  private logout() {
    //logout
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
}
