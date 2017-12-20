import {autoinject} from "aurelia-framework";
import {ValidationRules, ValidationControllerFactory, validateTrigger, ValidationController} from "aurelia-validation";
import {PeopleApi} from "../../api/group/people-api";
import {Router} from 'aurelia-router';

@autoinject
export class Signup {

  private signUpForm: SignUpForm;
  private validationController: ValidationController;
  private company: any;

  constructor(private controllerFactory: ValidationControllerFactory,
              private router: Router,
              private peopleApi: PeopleApi) {
    this.validationController = controllerFactory.createForCurrentScope();
    this.validationController.validateTrigger = validateTrigger.manual;
  }

  activate(){
    this.signUpForm = new SignUpForm();
    ValidationRules
      .ensure("password").required().withMessage("password must be filled in")
      .ensure("password2").required().withMessage("password must be filled in")
      // .equals("password").withMessage("passwords must be equal")
      .ensure("email").required().withMessage("must insert a email-address")
      .ensure("companyName").required().withMessage("must insert a company name")
      .ensure("newGroupName").required().withMessage("must insert a group name for Azure")
      .on(SignUpForm);
  }

  private logout() {
    firebase.auth().signOut().then(result => {
      this.router.navigate("login-page");
    });
  }

  private submit() {
    this.validationController.validate({object: this.signUpForm}).then(result => {
      if(result.valid === true) {
        firebase.auth().createUserWithEmailAndPassword(this.signUpForm.email, this.signUpForm.password).then(result => {
          console.log(result);
          firebase.database().ref("Users/" + result.uid).once("value").set({
            name: this.signUpForm.companyName
          });
          firebase.database().ref("Companies/" + this.signUpForm.companyName + "/" + result.uid).set({
            name: this.signUpForm.companyName,
            group: this.signUpForm.newGroupName,
            role: "user"
          }).then(() => {
            this.peopleApi.createGroup(this.signUpForm.newGroupName).then(() => {
              this.logout();
            }).catch(error => {
              console.log(error);
            });
          }).catch(error => {
            console.log(error);
          });
        }).catch(error => {
          console.log(error);
        });
      }
    });
  }
}

class SignUpForm {
  public email: string;
  public password: string;
  public password2: string;
  public newGroupName: string;
  public companyName: string;


  constructor() {
    this.email = null;
    this.password = null;
    this.password2 = null;
    this.newGroupName = null;
    this.companyName = null;
  }
}
