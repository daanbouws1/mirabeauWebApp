import {autoinject} from "aurelia-framework";

@autoinject
export class App {

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
    this.navtoggle = true;
    config.map([
      {route: ["", "/", 'home'], name: 'home', moduleId: './pages/groupTable/group-page', nav: true, title: 'Home'},
      {route: ['text'], name: 'text', moduleId: './pages/textTable/text-table', nav: true, title: 'Text'},
      {route: ['signup'], name: 'signup', moduleId: './pages/signup/signup', nav: true, title: 'Sign Up'},
      {route: ['nav'], name: 'nav', moduleId: './nav/nav', nav: false, title: 'Navigation'},
      {route: ['calls'], name: 'calls', moduleId: './pages/calls/calls', nav: false, title: 'callcounter'}
    ]);
  }
}
