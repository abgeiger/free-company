var express = require('express');
var router = express.Router();
var pool = require('../modules/pool');

router.get('/', function (req, res) {
  pool.connect(function (errorConnectingToDatabase, client, done) {
    if (errorConnectingToDatabase) {
      console.log('error', errorConnectingToDatabase);
      res.sendStatus(500);
    } else {
      var userId = req.query.id;
      client.query(`SELECT * FROM game 
                    JOIN game ON 
                    WHERE $1 
                    ORDER BY id DESC 
                    LIMIT 1;`, [userId], function (errorMakingDatabaseQuery, result) {
        done();
        if (errorMakingDatabaseQuery) {
          console.log('error', errorMakingDatabaseQuery);
          res.sendStatus(500);
        } else {
          var game = result.rows;
          if (game) {}
        }
      });
    }
  });
});

// client.query(`SELECT * FROM regiment ORDER BY id;`, function (errorMakingDatabaseQuery, result) {
//   done();
//   if (errorMakingDatabaseQuery) {
//     console.log('error', errorMakingDatabaseQuery);
//     res.sendStatus(500);
//   } else {
//     res.send(result.rows);
//   }
// });

// router.get('/', function (req, res) {
//   pool.connect(function (errorConnectingToDatabase, client, done) {
//     if (errorConnectingToDatabase) {
//       console.log('error', errorConnectingToDatabase);
//       res.sendStatus(500);
//     } else {
//       client.query(`SELECT * FROM game 
//                     WHERE $1 
//                     ORDER BY id DESC 
//                     LIMIT 1;`, [req.query.id], function (errorMakingDatabaseQuery, result) {
//         done();
//         if (errorMakingDatabaseQuery) {
//           console.log('error', errorMakingDatabaseQuery);
//           res.sendStatus(500);
//         } else {
//           res.send(result.rows);
//         }
//       });
//     }
//   });
// });

module.exports = router;