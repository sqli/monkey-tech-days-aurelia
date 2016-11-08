define('app',["require", "exports"], function (require, exports) {
    "use strict";
    var App = (function () {
        function App() {
        }
        App.prototype.configureRouter = function (config) {
            config.title = 'Monkey Tech Days Aurelia';
            config.options.pushState = true;
            config.options.root = '/';
            config.map([
                { route: 'login', name: 'login', moduleId: './login', title: 'Login' },
                { route: 'quizz', name: 'quizz', moduleId: './quizz', title: 'Quizz' },
                { route: 'result', name: 'result', moduleId: './result', title: 'Result' },
                { route: '', redirect: 'login' }
            ]);
        };
        return App;
    }());
    exports.App = App;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('service/quizz',["require", "exports", 'aurelia-framework', 'aurelia-fetch-client'], function (require, exports, aurelia_framework_1, aurelia_fetch_client_1) {
    "use strict";
    var endpoint = 'http://ilaborie.org:9010/api/';
    var QuizzService = (function () {
        function QuizzService(httpClient) {
            this.httpClient = httpClient;
            this.login = window.sessionStorage.getItem('login');
        }
        QuizzService.prototype.getQuizz = function () {
            if (window.sessionStorage.getItem('quizz')) {
                return JSON.parse(window.sessionStorage.getItem('quizz'));
            }
        };
        QuizzService.prototype.setQuizz = function (quizz) {
            window.sessionStorage.setItem('quizz', JSON.stringify(quizz));
        };
        QuizzService.prototype.initQuizz = function (login) {
            return this.httpClient.fetch(endpoint + 'quizz?userName=' + login)
                .then(function (response) { return response.json(); });
        };
        QuizzService.prototype.getNextQuestion = function () {
            var _this = this;
            var index = this.getIndexOfNextQuestion();
            return this.httpClient.fetch(endpoint + 'quizz/' + this.getQuizz().id + '/' + index)
                .then(function (response) { return response.json(); }).then(function (response) {
                return {
                    image: {
                        url: response.url,
                        copyright: response.attribution
                    },
                    responses: _this.getQuizz().questions[index].responses
                };
            });
        };
        QuizzService.prototype.getResponse = function () {
            var response = [];
            if (window.sessionStorage.getItem('responses')) {
                response = JSON.parse(window.sessionStorage.getItem('responses'));
            }
            return response;
        };
        QuizzService.prototype.clear = function () {
            window.sessionStorage.clear();
        };
        QuizzService.prototype.hasNextQuestion = function () {
            return this.getIndexOfNextQuestion() < this.getQuizz().questions.length;
        };
        QuizzService.prototype.getIndexOfNextQuestion = function () {
            return this.getResponse().length;
        };
        QuizzService.prototype.pushResponse = function (response) {
            var responses = this.getResponse();
            responses.push(response);
            window.sessionStorage.setItem('responses', JSON.stringify(responses));
        };
        QuizzService.prototype.getResult = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (!_this.getQuizz()) {
                    reject(new Error('Car!'));
                    return;
                }
                _this.httpClient.fetch(endpoint + 'quizz/' + _this.getQuizz().id + '/', {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({ responses: _this.getResponse() })
                }).then(function (response) {
                    if (response.status < 200 || response.status >= 400) {
                        reject(new Error('Car!'));
                    }
                    else {
                        resolve(response.json());
                    }
                });
            });
        };
        QuizzService.prototype.getLeaderboard = function () {
            return this.httpClient.fetch(endpoint + 'leaderboard', {}).then(function (response) { return response.json(); });
        };
        QuizzService = __decorate([
            aurelia_framework_1.inject(aurelia_fetch_client_1.HttpClient), 
            __metadata('design:paramtypes', [aurelia_fetch_client_1.HttpClient])
        ], QuizzService);
        return QuizzService;
    }());
    exports.QuizzService = QuizzService;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('login',["require", "exports", 'aurelia-framework', './service/quizz', 'aurelia-router'], function (require, exports, aurelia_framework_1, quizz_1, aurelia_router_1) {
    "use strict";
    var Login = (function () {
        function Login(quizzService, router) {
            this.quizzService = quizzService;
            this.router = router;
            this.login = '';
        }
        Login.prototype.signup = function () {
            var _this = this;
            this.quizzService.initQuizz(this.login).then(function (quizz) {
                _this.quizzService.setQuizz(quizz);
                _this.router.navigate('quizz');
            });
        };
        Login = __decorate([
            aurelia_framework_1.inject(quizz_1.QuizzService, aurelia_router_1.Router), 
            __metadata('design:paramtypes', [quizz_1.QuizzService, aurelia_router_1.Router])
        ], Login);
        return Login;
    }());
    exports.Login = Login;
});

define('main',["require", "exports", './environment'], function (require, exports, environment_1) {
    "use strict";
    Promise.config({
        warnings: {
            wForgottenReturn: false
        }
    });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources');
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('quizz',["require", "exports", 'aurelia-framework', './service/quizz', 'aurelia-router'], function (require, exports, aurelia_framework_1, quizz_1, aurelia_router_1) {
    "use strict";
    var Quizz = (function () {
        function Quizz(quizzService, router) {
            this.quizzService = quizzService;
            this.router = router;
            this.quizz = quizzService.getQuizz();
            if (!this.quizz) {
                this.router.navigate('login');
            }
            else {
                this.diplayQuestion();
            }
        }
        Quizz.prototype.diplayQuestion = function () {
            var _this = this;
            if (this.quizzService.hasNextQuestion()) {
                this.quizzService.getNextQuestion().then(function (question) {
                    _this.question = question;
                });
            }
            else {
                this.router.navigate('result');
            }
        };
        Quizz.prototype.next = function (response) {
            this.quizzService.pushResponse(response);
            this.diplayQuestion();
        };
        Quizz = __decorate([
            aurelia_framework_1.inject(quizz_1.QuizzService, aurelia_router_1.Router), 
            __metadata('design:paramtypes', [quizz_1.QuizzService, aurelia_router_1.Router])
        ], Quizz);
        return Quizz;
    }());
    exports.Quizz = Quizz;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('result',["require", "exports", 'aurelia-framework', './service/quizz', 'aurelia-router'], function (require, exports, aurelia_framework_1, quizz_1, aurelia_router_1) {
    "use strict";
    var Result = (function () {
        function Result(quizzService, router) {
            var _this = this;
            this.quizzService = quizzService;
            this.router = router;
            quizzService.getResult().then(function (result) {
                quizzService.clear();
                _this.result = result;
            }).catch(function (error) {
                quizzService.clear();
                _this.router.navigate('login');
            });
            quizzService.getLeaderboard().then(function (leaderboard) {
                _this.leaderboard = leaderboard;
            });
        }
        Result = __decorate([
            aurelia_framework_1.inject(quizz_1.QuizzService, aurelia_router_1.Router), 
            __metadata('design:paramtypes', [quizz_1.QuizzService, aurelia_router_1.Router])
        ], Result);
        return Result;
    }());
    exports.Result = Result;
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
    }
    exports.configure = configure;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n\n  <require from=\"./login\"></require>\n\n  <nav class=\"navbar navbar-default\">\n    <div class=\"container-fluid\">\n      <div class=\"navbar-header\">\n        <a class=\"navbar-brand\" href=\"/quizz\">\n          Aurelia\n        </a>\n      </div>\n    </div>\n  </nav>\n\n  <router-view></router-view>\n\n</template>\n"; });
define('text!login.html', ['module'], function(module) { module.exports = "<template>\n\n  <form class=\"form-signin col-xs-12 col-sm-6\" role=\"form\" submit.delegate=\"signup()\">\n\n    <h2 class=\"form-signin-heading\">Please sign in!</h2>\n\n    <label for=\"login\" class=\"sr-only\">Login</label>\n    <input id=\"login\" value.bind=\"login\" placeholder=\"Enter your login here...\" class=\"form-control\" placeholder=\"Email address\" required autofocus/>\n\n    <hr/>\n\n    <button class=\"btn btn-lg btn-default btn-block\" type=\"submit\">Start the quizz</button>\n  </form>\n\n</template>\n"; });
define('text!quizz.html', ['module'], function(module) { module.exports = "<template>\n\n  <h2>Qui est cet animal ?</h2>\n\n  <div class=\"col-xs-12\">\n\n    <img class=\"col-xs-12 col-sm-6\" src=\"${question.image.url}\" alt=\"${question.image.copyright}\">\n\n    <div class=\"list-group col-xs-12 col-sm-6\">\n      <button type=\"button\" class=\"list-group-item\" repeat.for=\"response of question.responses\" click.delegate=\"next(response)\">\n        ${response}\n      </button>\n    </div>\n\n  </div>\n\n</template>\n"; });
define('text!result.html', ['module'], function(module) { module.exports = "<template>\n\n  <h2>Result</h2>\n\n  <ul class=\"list-group\">\n    <li class=\"list-group-item active\">\n      <span class=\"badge\">${result.score}</span>\n      ${result.userName} (${result.duration} s)\n    </li>\n    <li class=\"list-group-item\" repeat.for=\"item of leaderboard\">\n      <span class=\"badge\">${item.score}</span>\n      ${item.userName} (${item.duration} s)\n    </li>\n  </ul>\n\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map