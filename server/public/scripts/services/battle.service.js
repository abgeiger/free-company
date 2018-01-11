myApp.service('BattleService', function ($http, $location) {
  console.log('BattleService Loaded');
  var self = this;

  self.regiments = { list: [] };
  self.messages = { list: [] };

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
      console.log('new game response:', response);
    });
  };

  self.nextRound = function () {
    $http({
      method: 'GET',
      url: '/game/nextRound'
    }).then(function (response) {
      console.log('next round result', response);
      // self.regiments.list.push(response.data[0].rows[0]);
      var newRegiments = [];
      for (var i = 0; i < response.data.length; i++) {
        newRegiments.push(response.data[i].rows[0]);
      }
      self.regiments.list = newRegiments;

      var newMessages = [];
      for (var i = 0; i < response.data.length; i++) {
        if (response.data[i].rows[0].text) {
          newMessages.push(response.data[i].rows[0].text);
        }
      }
      self.messages.list = newMessages;
    });
  };

  self.nextRound();
});