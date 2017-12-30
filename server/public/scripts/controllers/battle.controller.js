myApp.controller('BattleController', function(BattleService) {
    console.log('BattleController created');
    var bc = this;
    bc.testMessage = BattleService.testMessage;

    console.log(bc.testMessage);
    
  });
  