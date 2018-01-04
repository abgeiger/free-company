var express = require('express');
var router = express.Router();
var pool = require('../modules/pool');

router.post('/new', function (req, res) {

    // add new game
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
                    var gameId = result.rows[0].id;

                    // get regiment templates
                    pool.connect(function (errorConnectingToDatabase, client, done) {
                        if (errorConnectingToDatabase) {
                        console.log('error', errorConnectingToDatabase);
                        res.sendStatus(500);
                        } else {
                            client.query(`SELECT * FROM regiment_template
                                        ORDER BY id;`, function (errorMakingDatabaseQuery, result) {
                                done();
                                if (errorMakingDatabaseQuery) {
                                console.log('error', errorMakingDatabaseQuery);
                                res.sendStatus(500);
                                } else {
                                    res.send(result.rows);
                                    

                                    // post new regiments
                                    // pool.connect(function (errorConnectingToDatabase, client, done) {
                                    //     if (errorConnectingToDatabase) {
                                    //     console.log('error', errorConnectingToDatabase);
                                    //     res.sendStatus(500);
                                    //     } else {
                                    //         var gameId = req.query.id;
                                    //         client.query(`;`, [userId], function (errorMakingDatabaseQuery, result) {
                                    //             done();
                                    //             if (errorMakingDatabaseQuery) {
                                    //             console.log('error', errorMakingDatabaseQuery);
                                    //             res.sendStatus(500);
                                    //             } else {
                                    //             res.send(result.rows);
                                    //             }
                                    //         });
                                    //     }
                                    // }); // end post new regiments
                                }
                            });
                        }
                    }); // end get regiment templates
                }
            });
        }
    }); // end add new game
});

module.exports = router;