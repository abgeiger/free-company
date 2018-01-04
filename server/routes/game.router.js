var express = require('express');
var router = express.Router();
var pool = require('../modules/pool');

router.put('/new', function (req, res) {
  pool.connect(function (errorConnectingToDatabase, client, done) {
    if (errorConnectingToDatabase) {
      console.log('error', errorConnectingToDatabase);
      res.sendStatus(500);
    } else {
      var userId = req.user.id;
      client.query(`INSERT INTO game (round, user_id)
                    VALUES (0, $1)
                    RETURNING id;`, [userId], function (errorMakingDatabaseQuery, result) {
        done();
        if (errorMakingDatabaseQuery) {
          console.log('error', errorMakingDatabaseQuery);
          res.sendStatus(500);
        } else {
          res.send(result.rows);
        }
      });
    }
  });
});

module.exports = router;