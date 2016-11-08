import {inject} from 'aurelia-framework';
import {QuizzService} from './service/quizz';
import {Router} from 'aurelia-router';

@inject(QuizzService, Router)
export class Result {


  constructor(public quizzService:QuizzService, public router:Router){

    quizzService.getResult().then(result => {
      quizzService.clear();
      this.result = result;
    }).catch(error => {
      quizzService.clear();
      this.router.navigate('login');
    });

    quizzService.getLeaderboard().then(leaderboard => {
      this.leaderboard = leaderboard;
    });

  }

}
