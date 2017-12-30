import {autoinject} from "aurelia-framework";

@autoinject
export class LoginRouter {

  private router;
  private user: any;
  private navtoggle: boolean;
  private currentUser: any;
  private company: string;

  constructor() {
  }

  configureRouter(config, router) {
    this.router = router;
    config.title = "Mirabeau Web App";
    const navStrat = instruction => {
      instruction.config.redirect = router.navigation[0].config.route;
    };
    config.map([
      {route: ["", "/", 'text', 'signup', 'calls', 'home', 'login-page'], name: 'login-page', moduleId: './pages/login/login-page', nav: true, title: 'Login Page'},
    ]);
  }
}
