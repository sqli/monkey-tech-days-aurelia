import {Redirect, NavigationInstruction, RouterConfiguration} from 'aurelia-router';

export class App {
  configureRouter(config: RouterConfiguration): void {
    config.title = 'Monkey Tech Days Aurelia';
    config.options.pushState = true;
    config.options.root = '/';
    config.map([
      { route: 'login',   name: 'login',    moduleId: './login',    title: 'Login' },
      { route: 'quizz',   name: 'quizz',    moduleId: './quizz',    title: 'Quizz' },
      { route: 'result',  name: 'result',   moduleId: './result',   title: 'Result' },
      { route: '',      redirect: 'login' }
    ]);
  }
}
