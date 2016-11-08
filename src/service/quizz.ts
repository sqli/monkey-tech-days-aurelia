import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

const endpoint = 'http://ilaborie.org:9010/api/';

@inject(HttpClient)
export class QuizzService {

  quizz:any;

  constructor(public httpClient:HttpClient) {
    this.login = window.sessionStorage.getItem('login');
  }

  getQuizz(){
    if(window.sessionStorage.getItem('quizz')){
      return JSON.parse(window.sessionStorage.getItem('quizz'));
    }
  }

  setQuizz(quizz:any){
    window.sessionStorage.setItem('quizz', JSON.stringify(quizz));
  }

  initQuizz(login:string){
    return this.httpClient.fetch(endpoint + 'quizz?userName=' + login)
      .then(response => response.json());
  }

  getNextQuestion(){
    let index = this.getIndexOfNextQuestion();
    return this.httpClient.fetch(endpoint + 'quizz/' + this.getQuizz().id + '/' + index)
      .then(response => response.json()).then(response => {
        return {
          image: {
            url: response.url,
            copyright: response.attribution
          },
          responses: this.getQuizz().questions[index].responses
        }
      });
  }

  getResponse(){
    var response = [];
    if(window.sessionStorage.getItem('responses')){
      response = JSON.parse(window.sessionStorage.getItem('responses'));
    }
    return response;
  }

  clear(){
    window.sessionStorage.clear();
  }

  hasNextQuestion(){
    return this.getIndexOfNextQuestion() < this.getQuizz().questions.length;
  }

  getIndexOfNextQuestion(){
    return this.getResponse().length;
  }

  pushResponse(response:string){
    var responses = this.getResponse();
    responses.push(response);
    window.sessionStorage.setItem('responses', JSON.stringify(responses));
  }

  getResult(){

    return new Promise((resolve, reject) => {
      if(!this.getQuizz()){
        reject(new Error('Car!'));
        return;
      }
      this.httpClient.fetch(endpoint + 'quizz/' + this.getQuizz().id + '/', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({responses : this.getResponse()})
      }).then(response => {
        if(response.status < 200 || response.status >= 400){
          reject(new Error('Car!'));
        }else{
          resolve(response.json());
        }
      })
    });
  }

  getLeaderboard(){
    return this.httpClient.fetch(endpoint + 'leaderboard', {
    }).then(response => response.json());
  }

}
