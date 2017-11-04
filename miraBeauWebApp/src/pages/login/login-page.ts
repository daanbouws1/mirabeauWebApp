import {autoinject} from "aurelia-framework";
import {Router} from 'aurelia-router';

@autoinject
export class LoginPage {

  private email: string;
  private password: string;
  private passBool: boolean;

  constructor(private router: Router) {}

  activate() {

  }

  login(email: string, password: string) {
    firebase.auth().signInWithEmailAndPassword(email, password).then(error => {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;

      if (errorCode == null) {
        this.passBool = true;
        this.router.navigate("home");
      } else {
        this.passBool = false;
      }
    });
  }
}


// firebase.auth().createUserWithEmailAndPassword(email, password).catch(error => {
//   // Handle Errors here.
//   let errorCode = error.code;
//   let errorMessage = error.message;
//   // ...
//   console.log(errorCode,errorMessage);
// });
