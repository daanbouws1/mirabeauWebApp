import {autoinject} from "aurelia-framework";


@autoinject
export class App {
  router;

  constructor() {}

  configureRouter(config,router) {
    config.title = "Mirabeau Web App";
    config.map([
      {route: 'login-page', name: 'login-page', moduleId: './pages/login/login-page', nav: true, title: 'Login Page'},
      {route: ['', 'home'], name: 'home', moduleId: './pages/groupTable/group-page', nav: true, title: 'Home'}
    ]);
    this.router = router;
  }
}
