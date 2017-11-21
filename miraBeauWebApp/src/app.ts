import {autoinject} from "aurelia-framework";

@autoinject
export class App {
  router;

  constructor() {}

  configureRouter(config,router) {
    this.router = router;
    config.title = "Mirabeau Web App";
    const navStrat = instruction => {
      instruction.config.redirect = router.navigation[1].config.route;
    };
    config.map([
      {route: "", navigationStrategy: navStrat},
      {route: ['login-page'], name: 'login-page', moduleId: './pages/login/login-page', nav: true, title: 'Login Page'},
      {route: ['home'], name: 'home', moduleId: './pages/groupTable/group-page', nav: true, title: 'Home'},
      {route: ['text'], name: 'text', moduleId: './pages/textTable/text-table', nav: true, title: 'Text'},
      {route: ['signup'], name: 'signup', moduleId: './pages/signup/signup', nav: true, title: 'Sign Up'}
    ]);

  }
}
