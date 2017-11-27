import {autoinject} from "aurelia-framework"
import {Router} from 'aurelia-router';

@autoinject
export class Nav {

  private currentUser: any;
  private someOptions: any[];
  private selectedValue: any[];

  constructor(private router: Router) {
    let user: any = firebase.auth().currentUser;
    firebase.database().ref("Companies/" + user.uid).once("value").then(result => {
      this.currentUser = result.val();
    });

    this.selectedValue = [];

    this.someOptions = [
      { value: "signup", name: "Sign-up" },
      { value: "login-page", name: "Log-out" }
    ];
  }

  // private signUp() {
  //   this.router.navigate("signup");
  // }

  private dropdown(option) {s
    if (!(option.value === "login-page")) {
      this.router.navigate(option.value);
    } else {
      this.logout();
    }
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
}
