import {bindable, autoinject} from "aurelia-framework";

@autoinject
export class Navigation {

  @bindable router;
  private navigation;
  private navigationTree: any[] = [];

  constructor(){}

  attached() {
    this.constructNavBar(this.router);
  }

  constructNavBar(router) {
    router.navigation.forEach(section => {
      this.navigationTree.push(section);
    });
  }

}
