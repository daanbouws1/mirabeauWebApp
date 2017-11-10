import {autoinject} from "aurelia-framework";
import {Router} from 'aurelia-router';

@autoinject
export class LoginPage {

  private email: string;
  private password: string;
  private passBool: boolean;
  private errorMessage: string;

  constructor(private router: Router) {
    this.myKeypressCallback = this.keypressInput.bind(this);
  }

  activate() {
    let user = firebase.auth().currentUser;
    if (user) {
      this.router.navigate('home');
    }
    window.addEventListener('keypress', this.myKeypressCallback, false);
  }

  deactivate() {
    window.removeEventListener('keypress', this.myKeypressCallback);
  }

  keypressInput(e) {
    if (e.code === "Enter") {
      this.login();
    }
  }

  login() {
    if (!(this.email ==null) && !(this.password == null)){
      this.errorMessage = "";
      this.passBool = true;
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(() => {
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
