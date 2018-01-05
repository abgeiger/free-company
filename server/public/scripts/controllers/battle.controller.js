myApp.controller('BattleController', function(BattleService) {
    console.log('BattleController created');
    var bc = this;

    bc.newGame = BattleService.newGame;

    // bc.newGame();

    bc.data = BattleService.data;

    bc.testMessage = BattleService.testMessage;
    console.log(bc.testMessage);
  });
  