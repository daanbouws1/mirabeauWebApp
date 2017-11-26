import {autoinject} from "aurelia-framework";
import {ValidationRules, ValidationControllerFactory, validateTrigger, ValidationController} from "aurelia-validation";
import {PeopleApi} from "../../api/group/people-api";

@autoinject
export class Signup {

  private signUpForm: SignUpForm;
  private validationController: ValidationController;

  constructor(private controllerFactory: ValidationControllerFactory,
              private peopleApi: PeopleApi) {
    this.validationController = controllerFactory.createForCurrentScope();
    this.validationController.validateTrigger = validateTrigger.manual;
  }

  activate(){
    this.signUpForm = new SignUpForm();
    ValidationRules
      .ensure("password").required().withMessage("password must be filled in")
      .ensure("password2").required().withMessage("password must be filled in")
      .equals(this.password).withMessage("passwords must be equal")
      .ensure("email").required().withMessage("must insert a email-address")
      .ensure("companyName").required().withMessage("must insert a company name")
      .ensure("newGroupName").required().withMessage("must insert a group name for Azure")
      .on(SignUpForm);
  }

  private submit() {
    this.validationController.validate({object: this.signUpForm}).then(result => {
      if(result.valid === true) {
        firebase.auth().createUserWithEmailAndPassword(this.signUpForm.email, this.password).then(result => {
          firebase.database().ref("Companies/" + this.signUpForm.companyName).set({
            name: this.signUpForm.companyName,
            group: this.signUpForm.newGroupName,
            admin: {
              id: result.uid,
              role: user
            }
          }).then(result => {
            this.peopleApi.createGroup(this.newGroupName).then(result => {
              // TODO
            }).catch(error => {
              // TODO
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
  private email: string;
  private password: string;
  private password2: string;
  private newGroupName: string;
  private companyName: string;


  constructor() {
    this.email = null;
    this.password = null;
    this.password2 = null;
    this.newGroupName = null;
    this.companyName = null;
  }
}
