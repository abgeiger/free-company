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
                                    var newRegimentsArray = [];
                                    for (var i = 0; i < regimentArray.length; i++) {
                                        var newRegiment = [];

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
                                    postNewRegiment(req, res, newRegimentsArray, index, maxIndex);
                                }
                            });
                        }
                    }); // end get regiment templates
                }
            });
        }
    }); // end add new game
});

function postNewRegiment(req, res, newRegimentsArray, index, maxIndex) {
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

router.get('/nextRound', function (req, res) {
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
        console.log('error', errorConnectingToDatabase);
        res.sendStatus(500);
        } else {
            client.query(`SELECT * FROM game
                        JOIN regiment
                            ON game.game_id = regiment.game_id
                        WHERE game.game_id = 1`, function (errorMakingDatabaseQuery, result) {
                done();
                if (errorMakingDatabaseQuery) {
                console.log('error', errorMakingDatabaseQuery);
                res.sendStatus(500);
                } else {
                    res.send(combat(result.rows));
                    // res.send(result.rows);
                }
            });
        }
    }); // end regiment get request
}); // end nextRound()

function combat(regimentArray) {
    for (var i = 0; i < regimentArray.length; i++) {
        if (regimentArray[i].is_friendly === true && regimentArray[i].front === 'left') {
            var leftRegiment = regimentArray[i];
        } else if (regimentArray[i].is_friendly === true && regimentArray[i].front === 'center') {
            var centerRegiment = regimentArray[i];
        } else if (regimentArray[i].is_friendly === true && regimentArray[i].front === 'right') {
            var rightRegiment = regimentArray[i];
        } else if (regimentArray[i].is_friendly === false && regimentArray[i].front === 'left') {
            var leftRegimentEnemy = regimentArray[i];
        } else if (regimentArray[i].is_friendly === false && regimentArray[i].front === 'center') {
            var centerRegimentEnemy = regimentArray[i];
        } else if (regimentArray[i].is_friendly === false && regimentArray[i].front === 'right') {
            var rightRegimentEnemy = regimentArray[i];
        }
    }
    // return [leftRegiment, centerRegiment, rightRegiment, leftRegimentEnemy, centerRegimentEnemy, rightRegimentEnemy];
    var leftFront = [leftRegiment, leftRegimentEnemy];
    var centerFront = [centerRegiment, centerRegimentEnemy];
    var rightFront = [rightRegiment, rightRegimentEnemy];

    
}

function clash(front) {

}

var exampleArray = [{"game_id":1,"round":0,"user_id":1,"regiment_id":7,"front":"left","power":100,"starting_power":100,"morale":30,"morale_ratio":0,"is_friendly":true,"faction_id":1},{"game_id":1,"round":0,"user_id":1,"regiment_id":8,"front":"center","power":100,"starting_power":100,"morale":30,"morale_ratio":0,"is_friendly":true,"faction_id":1},{"game_id":1,"round":0,"user_id":1,"regiment_id":9,"front":"right","power":100,"starting_power":100,"morale":30,"morale_ratio":0,"is_friendly":true,"faction_id":1},{"game_id":1,"round":0,"user_id":1,"regiment_id":10,"front":"left","power":140,"starting_power":140,"morale":21,"morale_ratio":0,"is_friendly":false,"faction_id":2},{"game_id":1,"round":0,"user_id":1,"regiment_id":11,"front":"center","power":140,"starting_power":140,"morale":21,"morale_ratio":0,"is_friendly":false,"faction_id":2},{"game_id":1,"round":0,"user_id":1,"regiment_id":12,"front":"right","power":140,"starting_power":140,"morale":21,"morale_ratio":0,"is_friendly":false,"faction_id":2}]

module.exports = router;