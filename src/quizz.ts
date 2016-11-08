import {inject} from 'aurelia-framework';
import {QuizzService} from './service/quizz';
import {Router} from 'aurelia-router';

@inject(QuizzService, Router)
export class Quizz {

  quizz:any = quizzService.getQuizz();

  constructor(public quizzService:QuizzService, public router:Router){

    if(!this.quizz){
      this.router.navigate('login');
    }else{
      this.diplayQuestion();
    }

  }

  diplayQuestion(){
    if(this.quizzService.hasNextQuestion()){
      this.quizzService.getNextQuestion().then(question => {
        this.question = question;
      });
    }else{
      this.router.navigate('result');
    }

  }

  next(response){
    this.quizzService.pushResponse(response);
    this.diplayQuestion();
  }

}
