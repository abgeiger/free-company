myApp.service('BattleService', function ($http, $location) {
  console.log('BattleService Loaded');
  var self = this;

  self.regiments = { friendly: [], enemy: [] };
  self.messages = { list: [] };

  self.newGame = function () {
    $http({
      method: 'POST',
      url: '/game/new'
    }).then(function (response) {
      console.log('new game response:', response.data);

      var newFriendlyRegiments = [];
      var newEnemyRegiments = [];

      for (var i = 0; i < 3; i++) {
        newFriendlyRegiments.push(response.data[i]);
      }
      for (var i = 3; i < 6; i++) {
        newEnemyRegiments.push(response.data[i]);
      }

      self.regiments.friendly = newFriendlyRegiments;
      self.regiments.enemy = newEnemyRegiments;
    });
  };

  self.nextRound = function () {
    $http({
      method: 'GET',
      url: '/game/nextRound'
    }).then(function (response) {
      console.log('next round result', response);

      var newFriendlyRegiments = [];
      var newEnemyRegiments = [];

      for (var i = 0; i < response.data.length; i += 2) {
        newFriendlyRegiments.push(response.data[i].rows[0]);
      }
      for (var i = 1; i < response.data.length; i += 2) {
        newEnemyRegiments.push(response.data[i].rows[0]);
    }
      self.regiments.friendly = newFriendlyRegiments;
      self.regiments.enemy = newEnemyRegiments;

      var newMessages = [];
      for (var i = 0; i < response.data.length; i += 2) {
        if (response.data[i].rows[0].text) {
          var message = '';
          message += 'Message from the ' + response.data[i].rows[0].front + ' front: ' + response.data[i].rows[0].text;
          newMessages.push(message);
        }
      }
      self.messages.list = newMessages;
    });
  };
});