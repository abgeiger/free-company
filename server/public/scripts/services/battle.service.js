myApp.service('BattleService', function ($http, $location) {
  console.log('BattleService Loaded');
  var self = this;
  self.testMessage = 'Test test battle test';

  self.regiments = { list: [] };
  self.data = { list: [] };

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
      console.log('new game response:', response.data);
    });
  };

  self.nextRound = function () {
    $http({
      method: 'GET',
      url: '/game/nextRound'
    }).then(function (response) {
      console.log('next round result', response);
      // self.data.list = response.data;
    });
  };

  self.nextRound();
});