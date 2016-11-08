import {inject} from 'aurelia-framework';
import {QuizzService} from './service/quizz';
import {Router} from 'aurelia-router';

@inject(QuizzService, Router)
export class Login {

  login:string = '';

  constructor(public quizzService:QuizzService, public router:Router){

  }

  signup():void {
    this.quizzService.initQuizz(this.login).then(quizz => {
      this.quizzService.setQuizz(quizz);
      this.router.navigate('quizz');
    });
  }

}
