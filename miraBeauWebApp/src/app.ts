import {autoinject} from "aurelia-framework";

@autoinject
export class App {

  private router;
  private user: any;
  private navtoggle: boolean;

  constructor() {}

  configureRouter(config, router) {
    this.user = firebase.auth().currentUser;
    if (!(this.user == null)) {
      firebase.database().ref("Companies/" + this.user.uid).once("value").then(result => {
        this.currentUser = result.val();
      });
      this._configureRouter(config,router,true)
    } else {
      this.navToggle = false;
    }
  }

  _configureRouter(config,router,loggedin) {
    this.router = router;
    config.title = "Mirabeau Web App";
    const navStrat = instruction => {
      instruction.config.redirect = router.navigation[1].config.route;
    };
    this.navtoggle = true;
    if (loggedin) {
      config.map([
        {route: "", navigationStrategy: navStrat},
        {route: ['login-page'], name: 'login-page', moduleId: './pages/login/login-page', nav: true, title: 'Login Page'},
        {route: ['home'], name: 'home', moduleId: './pages/groupTable/group-page', nav: true, title: 'Home'},
        {route: ['text'], name: 'text', moduleId: './pages/textTable/text-table', nav: true, title: 'Text'},
        {route: ['signup'], name: 'signup', moduleId: './pages/signup/signup', nav: true, title: 'Sign Up'},
        {route: ['branding'], name: 'branding', moduleId: './pages/branding/branding', nav: true, title: 'Branding'},
        {route: ['nav'], name: 'nav', moduleId: './nav/nav', nav: false, title: 'Navigation'}
      ]);
    } else {
      config.map([
        {route: ['login-page'], name: 'login-page', moduleId: './pages/login/login-page', nav: true, title: 'Login Page'},
      ]);
    }

  }
}
