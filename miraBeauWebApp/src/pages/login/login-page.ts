import {autoinject} from "aurelia-framework";
import {Router} from 'aurelia-router';

@autoinject
export class LoginPage {

  private email: string;
  private password: string;
  private passBool: boolean;
  private errorMessage: string;

  constructor(private router: Router) {}

  activate() {
    let user = firebase.auth().currentUser;
    if (user) {
      this.router.navigate('home');
    }
  }

  login(email: string, password: string) {
    if (!(email ==null) && !(password == null)){
      this.errorMessage = "";
      this.passBool = true;
      firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
        this.router.navigate("home");
      }).catch(error => {
        if (error.code) {
          this.passBool = false;
          this.errorMessage = error.message;
        }
      });
    } else {
      this.passBool = false;
      this.errorMessage = "Both input fields must be filled in in order to log in";
    }
  }
}


// firebase.auth().createUserWithEmailAndPassword(email, password).catch(error => {
//   // Handle Errors here.
//   let errorCode = error.code;
//   let errorMessage = error.message;
//   // ...
//   console.log(errorCode,errorMessage);
// });
