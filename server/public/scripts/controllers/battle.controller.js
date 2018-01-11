myApp.controller('BattleController', function(BattleService) {
    console.log('BattleController created');
    var bc = this;

    bc.regiments = BattleService.regiments;
    bc.messages = BattleService.messages;

    bc.newGame = BattleService.newGame;

    // bc.newGame();

    bc.data = BattleService.data;
  });
  