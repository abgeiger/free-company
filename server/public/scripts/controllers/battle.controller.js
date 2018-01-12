myApp.controller('BattleController', function(BattleService, UserService) {
    console.log('BattleController created');
    var bc = this;

    bc.regiments = BattleService.regiments;
    bc.messages = BattleService.messages;

    bc.newGame = BattleService.newGame;
    bc.nextRound = BattleService.nextRound;

    bc.newGame();

    bc.data = BattleService.data;
  });
  