myApp.service('BattleService', function ($http, $location) {
  console.log('BattleService Loaded');
  var self = this;

  self.regiments = { friendly: [], enemy: [] };
  self.messages = { list: [] };
  self.decisions = { list: [], current: '' };
  self.end = { won: false, lost: false }

  self.getDecisions = function () {
    $http({
      method: 'GET',
      url: '/game/decisions'
    }).then(function (response) {
      console.log('getDecisions result', response);

      var decisionsArray = response.data;

      for (var i = 0; i < decisionsArray.length; i++) {
        self.decisions.list.push(decisionsArray[i]);
      }
    });
  };

  self.newGame = function () {
    $http({
      method: 'POST',
      url: '/game/new'
    }).then(function (response) {
      console.log('new game response:', response.data);

      self.decisions.list = [];
      self.decisions.current = '';

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

      self.getDecisions();

      console.log('self.decisions.list:', self.decisions.list);
    });
  };

  self.nextRound = function () {
    if (self.decisions.current) {
      $http({
        method: 'POST',
        url: '/game/nextRound',
        data: self.decisions.current
      }).then(function (response) {
        console.log('next round result', response);
  
        self.decisions.list = [];
        self.decisions.current = '';
  
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

        self.gameOver(self.regiments.friendly, self.regiments.enemy);
  
        self.getDecisions();
      });
    } else {
      $http({
        method: 'POST',
        url: '/game/nextRound'
      }).then(function (response) {
        console.log('next round result', response);
  
        self.decisions = { list: [], current: '' };
  
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

        self.gameOver(self.regiments.friendly, self.regiments.enemy);
  
        self.getDecisions();
      });
    }
  };

  self.gameOver = function(friendly, enemy) {
    console.log('regiments:', self.regiments);
    

    var frontsLost = 0;
    var frontsWon = 0;
    var frontsTied = 0;

    for (var i = 0; i < friendly.length; i++) {
      if (enemy[i].status === 'victorious') {
        frontsLost++;
      } else if (friendly[i].status === 'victorious') {
        frontsWon++;
      } else if (friendly[i].status === 'broken' || friendly[i].status === 'destroyed') {
        frontsTied++;
      }
    }
    console.log('won, lost, tied:', frontsWon, frontsLost, frontsTied);
    

    if (frontsLost > 1) {
      self.messages.list.push('Our forces have broken and run like little babymen! The enemy is victorious.');

      self.end.lost = true;
      console.log('self.end:', self.end);
    } else if (frontsWon > 1) {
      self.messages.list.push('We have pushed the enemy back! The day is ours!');

      self.end.won = true;
      console.log('self.end:', self.end);
    } else if (frontsLost + frontsTied === 3) {
      self.messages.list.push('Our men faught bravely, but the enemy has broken through.');

      self.end.lost = true;
      console.log('self.end:', self.end);
    } else if (frontsWon + frontsTied === 3) {
      self.messages.list.push('We took heavy casualties, but we have prevailed! Good show, General!');

      self.end.won = true;
      console.log('self.end:', self.end);
    } else if (frontsWon === 1 && frontsTied === 1 && frontsLost === 1) {
      self.messages.list.push('The day has ended in a draw. We must prepair for a long campaign.');

      self.end.won = true;
      console.log('self.end:', self.end);
    }
  }
});