import {autoinject} from "aurelia-framework";

@autoinject
export class Calls {

  private callsData: any;
  private user: any;
  private company: any;
  private currentValue: any;
  private callsThisYear: number = 0;

  constructor(){}

  activate() {
    this.user = firebase.auth().currentUser;
    firebase.database().ref("Users/" + this.user.uid).once("value").then(result => {
      this.company = result.val().name;
      firebase.database().ref("Companies/" + this.company + "/api-call-data").once("value").then(result => {
        this.callsData = result.val();
        this.getThisMonthCalls();
        this.getThisYearCalls();
      });
    });
  }

  getThisMonthCalls() {
    this.currentValue = this.callsData[new Date().getFullYear()][new Date().getMonth() + 1];
  }

  private getThisYearCalls() {
    for (let item of this.callsData[new Date().getFullYear()]) {
      if (item > 0) {
        this.callsThisYear += parseInt(item);
      }
    }
  }
}
