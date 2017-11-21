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
    //check if user is already loggin in and redirect if so.
    let user = firebase.auth().currentUser;
    if (user) {
      this.router.navigate('home');
    }
    //Add keylistener
    window.addEventListener('keypress', this.myKeypressCallback, false);
  }

  deactivate() {
    //Remove keylistener
    window.removeEventListener('keypress', this.myKeypressCallback);
  }

  private keypressInput(e) {
    //listen for enter
    if (e.code === "Enter") {
      this.login();
    }
  }

  private login() {
    //sign in
    if (!(this.email ==null) && !(this.password == null)){
      this.errorMessage = "";
      this.passBool = true;
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(() => {
        this.router.navigate("home");
      }).catch(error => {
        //set feedback sign in failed.
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
