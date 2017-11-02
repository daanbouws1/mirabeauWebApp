import {bindable, autoinject} from "aurelia-framework";

@autoinject
export class Navigation {

  @bindable router;
  private navigation;
  private navigationTree: any[] = [];

  constructor(){}

  attached() {
    console.log(1);
    this.constructNavBar(this.router);
  }

  constructNavBar(router) {
    router.navigation.forEach(section => {
      console.log(1);
      this.navigationTree.push(section);
    });
  }

}
