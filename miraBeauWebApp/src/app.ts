import {autoinject} from "aurelia-framework";

@autoinject
export class App {
  router;

  constructor() {}

  configureRouter(config,router) {
    console.log(1);
      config.title = "Mirabeau Web App";
      config.map([
        {route: ['', 'home'], name: 'home', moduleId: './pages/groupTable/group-page', nav: true, title: 'Home'},
      ]);

    this.router = router;
  }
}
