myApp.service('BattleService', function ($http, $location) {
  console.log('BattleService Loaded');
  var self = this;
  self.testMessage = 'Test test battle test';

  self.regiments = { list: [] };

  // // get request for regiments in the current game
  // self.getRegiments = function (gameId) {
  //   $http({
  //     method: 'GET',
  //     url: '/regiments',
  //     params: gameId
  //   }).then(function (response) {
  //     console.log('regiments for this game:', response.data);
  //   });
  // };

  self.newGame = function () {
    $http({
      method: 'POST',
      url: '/game/new'
    }).then(function (response) {
      console.log('new game result', response.data);
    });
  };
});