import {autoinject} from "aurelia-framework";

@autoinject
export class Signup {

  private email: string;
  private password: string;
  private newGroupName: string;
  private companyName: string;

  constructor(){}

  activate(){}

  private submit() {
    console.log(this.email, this.password, this.newGroupName, this.companyName)
  }
}
