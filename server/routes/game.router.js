var express = require('express');
var router = express.Router();
var pool = require('../modules/pool');

// add new game and regiments
router.post('/new', function (req, res) {
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
        console.log('error', errorConnectingToDatabase);
        res.sendStatus(500);
        } else {
            var userId = req.user.id;
            client.query(`WITH new_game AS (
                            INSERT INTO game (round, user_id)
                            VALUES (0, $1)
                            RETURNING game_id
                        )
                        INSERT INTO regiment (front, power, starting_power, morale, morale_ratio, is_friendly, faction_id, game_id)
                        SELECT regiment_template.front, regiment_template.power, regiment_template.starting_power, regiment_template.morale, regiment_template.morale_ratio, regiment_template.is_friendly, regiment_template.faction_id, new_game.game_id
                        FROM regiment_template, new_game;`, [userId], function (errorMakingDatabaseQuery, result) {
                done();
                if (errorMakingDatabaseQuery) {
                console.log('error', errorMakingDatabaseQuery);
                res.sendStatus(500);
                } else {
                    res.sendStatus(201);
                }
            });
        }
    }); // end add new game
});

router.get('/nextRound', function (req, res) {
    updateRegiments(req, res);    
}); // end nextRound()

function updateRegiments(req, res) {
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
        console.log('error', errorConnectingToDatabase);
        res.sendStatus(500);
        } else {
            client.query(`SELECT * FROM game
                        JOIN regiment
                            ON game.game_id = regiment.game_id
                        WHERE game.game_id = 1;`, function (errorMakingDatabaseQuery, result) {
                done();
                if (errorMakingDatabaseQuery) {
                console.log('error', errorMakingDatabaseQuery);
                res.sendStatus(500);
                } else {
                    var originalRegiments = result.rows;
                    var updatedRegiments = combat(originalRegiments);

                    var regimentPromise0 = client.query(`UPDATE regiment
                                                        SET power = $1, morale = $2
                                                        WHERE game_id = $3
                                                            AND front = $4
                                                            AND is_friendly = $5
                                                        RETURNING *;`, [updatedRegiments[0].power, updatedRegiments[0].morale, 
                        updatedRegiments[0].game_id,updatedRegiments[0].front, updatedRegiments[0].is_friendly]);

                    var regimentPromise1 = client.query(`UPDATE regiment
                                                        SET power = $1, morale = $2
                                                        WHERE game_id = $3
                                                            AND front = $4
                                                            AND is_friendly = $5
                                                        RETURNING *;`, [updatedRegiments[1].power, updatedRegiments[1].morale, 
                        updatedRegiments[1].game_id,updatedRegiments[1].front, updatedRegiments[1].is_friendly]);

                    var regimentPromise2 = client.query(`UPDATE regiment
                                                        SET power = $1, morale = $2
                                                        WHERE game_id = $3
                                                            AND front = $4
                                                            AND is_friendly = $5
                                                        RETURNING *;`, [updatedRegiments[2].power, updatedRegiments[2].morale, 
                        updatedRegiments[2].game_id,updatedRegiments[2].front, updatedRegiments[2].is_friendly]);

                    var regimentPromise3 = client.query(`UPDATE regiment
                                                        SET power = $1, morale = $2
                                                        WHERE game_id = $3
                                                            AND front = $4
                                                            AND is_friendly = $5
                                                        RETURNING *;`, [updatedRegiments[3].power, updatedRegiments[3].morale, 
                        updatedRegiments[3].game_id,updatedRegiments[3].front, updatedRegiments[3].is_friendly]);

                    var regimentPromise4 = client.query(`UPDATE regiment
                                                        SET power = $1, morale = $2
                                                        WHERE game_id = $3
                                                            AND front = $4
                                                            AND is_friendly = $5
                                                        RETURNING *;`, [updatedRegiments[4].power, updatedRegiments[4].morale, 
                        updatedRegiments[4].game_id,updatedRegiments[4].front, updatedRegiments[4].is_friendly]);

                    var regimentPromise5 = client.query(`UPDATE regiment
                                                        SET power = $1, morale = $2
                                                        WHERE game_id = $3
                                                            AND front = $4
                                                            AND is_friendly = $5
                                                        RETURNING *;`, [updatedRegiments[5].power, updatedRegiments[5].morale, 
                        updatedRegiments[5].game_id,updatedRegiments[5].front, updatedRegiments[5].is_friendly]);

                    Promise.all([regimentPromise0, regimentPromise1, regimentPromise2, regimentPromise3, regimentPromise4, 
                        regimentPromise5]).then(function(resultOfAllPromises) {

                        console.log('result', resultOfAllPromises);
                        res.send(resultOfAllPromises);
                    }).catch(function(err){
                        console.log('Promise.all did not work!', err);
                        res.sendStatus(500);
                    })
                }
            });
        }
    }); // end regiment get request
}

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

    var updatedRegiments = [];

    var clash = function(friendly, enemy) {
        var friendlyDamageTaken = attackDamage(enemy.power) - attackDamage(friendly.power);
        if (friendlyDamageTaken < 0) {
            friendlyDamageTaken = 0;
        }
        friendlyDamageTaken += dice(4, 1);
    
        var enemyDamageTaken = attackDamage(friendly.power) - attackDamage(enemy.power);
        if (enemyDamageTaken < 0) {
            enemyDamageTaken = 0;
        }
        enemyDamageTaken += dice(4, 1);
    
        friendly.power -= friendlyDamageTaken;
        friendly.morale -= friendlyDamageTaken;
        enemy.power -= enemyDamageTaken;
        enemy.morale -= enemyDamageTaken;

        
        if (friendly.power < 0) {
            friendly.power = 0;
        }
        if (friendly.morale < 0) {
            friendly.morale = 0;
        }
        if (enemy.power < 0) {
            enemy.power = 0;
        }
        if (enemy.morale < 0) {
            enemy.morale = 0;
        }

        updatedRegiments.push(friendly);
        updatedRegiments.push(enemy);
    }

    clash(leftRegiment, leftRegimentEnemy);
    clash(centerRegiment, centerRegimentEnemy);
    clash(rightRegiment, rightRegimentEnemy);

    return updatedRegiments;
}

function attackDamage(power) {
    return Math.floor(power / 10);
}

function dice(numberOfSides, numberOfDice) {
    var result = 0;
    for (var i = 0; i < numberOfDice; i++) {
        result += Math.floor(Math.random() * (numberOfSides) + 1);
    }
    return result;
}

// var exampleArray = [{"game_id":1,"round":0,"user_id":1,"regiment_id":7,"front":"left","power":100,"starting_power":100,"morale":30,"morale_ratio":0,"is_friendly":true,"faction_id":1},{"game_id":1,"round":0,"user_id":1,"regiment_id":8,"front":"center","power":100,"starting_power":100,"morale":30,"morale_ratio":0,"is_friendly":true,"faction_id":1},{"game_id":1,"round":0,"user_id":1,"regiment_id":9,"front":"right","power":100,"starting_power":100,"morale":30,"morale_ratio":0,"is_friendly":true,"faction_id":1},{"game_id":1,"round":0,"user_id":1,"regiment_id":10,"front":"left","power":140,"starting_power":140,"morale":21,"morale_ratio":0,"is_friendly":false,"faction_id":2},{"game_id":1,"round":0,"user_id":1,"regiment_id":11,"front":"center","power":140,"starting_power":140,"morale":21,"morale_ratio":0,"is_friendly":false,"faction_id":2},{"game_id":1,"round":0,"user_id":1,"regiment_id":12,"front":"right","power":140,"starting_power":140,"morale":21,"morale_ratio":0,"is_friendly":false,"faction_id":2}]

module.exports = router;