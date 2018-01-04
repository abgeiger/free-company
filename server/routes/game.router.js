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
                                    var regimentArray = result.rows;
                                    var newRegiment = [];
                                    var newRegimentsArray = [];
                                    for (var i = 0; i < regimentArray.length; i++) {
                                        newRegiment.push(regimentArray[i].front);
                                        newRegiment.push(regimentArray[i].power);
                                        newRegiment.push(regimentArray[i].startingPower);
                                        newRegiment.push(regimentArray[i].morale);
                                        newRegiment.push(regimentArray[i].morale_ratio);
                                        newRegiment.push(regimentArray[i].is_friendly);
                                        newRegiment.push(regimentArray[i].faction_id);
                                        newRegiment.push(gameId);

                                        newRegimentsArray.push(newRegiment);
                                    }
                                    var index = 0;
                                    var maxIndex = newRegimentsArray.length;
                                    postNewRegiment(newRegimentsArray, index, maxIndex);
                                }
                            });
                        }
                    }); // end get regiment templates
                }
            });
        }
    }); // end add new game
});

function postNewRegiment(newRegimentsArray, index, maxIndex) {
    if (index < maxIndex) {
        var newRegiment;
        pool.connect(function (errorConnectingToDatabase, client, done) {
            if (errorConnectingToDatabase) {
            console.log('error', errorConnectingToDatabase);
            res.sendStatus(500);
            } else {client.query(`INSERT INTO regiment 
                            (front, power, startingPower, morale, morale_ratio, is_friendly, faction_id, game_id)
                            VALUES;`, newRegiment, function (errorMakingDatabaseQuery, result) {
                    done();
                    if (errorMakingDatabaseQuery) {
                    console.log('error', errorMakingDatabaseQuery);
                    res.sendStatus(500);
                    } else {
                        index++;
                        postNewRegiment(newRegimentsArray, index, maxIndex);
                    }
                });
            }
        });
    } else {
        res.send(newRegimentsArray);
    }
}

module.exports = router;