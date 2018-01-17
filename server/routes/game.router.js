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
            if (userId) {
                client.query(`WITH new_game AS (
                                INSERT INTO game (round, user_id)
                                VALUES (0, $1)
                                RETURNING game_id
                            )
                            INSERT INTO regiment (front, power, starting_power, morale, morale_ratio, is_friendly, faction_id, game_id)
                            SELECT regiment_template.front, regiment_template.power, regiment_template.starting_power, regiment_template.morale, regiment_template.morale_ratio, regiment_template.is_friendly, regiment_template.faction_id, new_game.game_id
                            FROM regiment_template, new_game
                            RETURNING *;`, [userId], function (errorMakingDatabaseQuery, result) {
                    done();
                    if (errorMakingDatabaseQuery) {
                    console.log('error', errorMakingDatabaseQuery);
                    res.sendStatus(500);
                    } else {
                        res.send(result.rows);
                    }
                });
            } else {
                done();
                res.sendStatus(500);
            }
        }
    }); // end add new game
});

router.get('/decisions', function (req, res) {
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
        console.log('error', errorConnectingToDatabase);
        res.sendStatus(500);
        } else {
            client.query(`SELECT * FROM decision
                        WHERE (on_start = true)
                        AND (unlimited = true OR uses > 0);`, function (errorMakingDatabaseQuery, result) {
                done();
                if (errorMakingDatabaseQuery) {
                console.log('error', errorMakingDatabaseQuery);
                res.sendStatus(500);
                } else {
                    res.send(result.rows);
                }
            });
        }
    }); // end add new game
});

router.post('/nextRound', function (req, res) {
    roundPlusOne(req, res);
    updateRegiments(req, res);
}); // end nextRound()

function updateRegiments(req, res) {
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
        console.log('error', errorConnectingToDatabase);
        res.sendStatus(500);
        } else {
            var userId = req.user.id;
            if (userId) {
                client.query(`WITH last_game AS (
                                SELECT game.game_id FROM game
                                WHERE user_id = $1
                                ORDER BY game.game_id DESC
                                LIMIT 1
                            )
                            SELECT * FROM last_game lg
                            JOIN regiment r ON lg.game_id = r.game_id;`,[userId], function (errorMakingDatabaseQuery, result) {
                    done();
                    if (errorMakingDatabaseQuery) {
                    console.log('error', errorMakingDatabaseQuery);
                    res.sendStatus(500);
                    } else {
                        var originalRegiments = result.rows;
                        if (req.body) {
                            var decision = req.body;
                            var updatedRegiments = combat(originalRegiments, decision);
                        } else {
                            var updatedRegiments = combat(originalRegiments);
                        }
                        

                        var regimentPromise0 = client.query(`WITH updated_regiment AS (
                                                                UPDATE regiment
                                                                SET power = $1, morale = $2, current_event_trigger = $3, status = $4
                                                                WHERE regiment_id = $5
                                                                RETURNING regiment.*
                                                            )
                                                            SELECT * FROM game
                                                            JOIN updated_regiment ON updated_regiment.game_id = game.game_id
                                                            LEFT JOIN event ON event.trigger = updated_regiment.current_event_trigger
                                                            LEFT JOIN message ON message.event_id = event.event_id;`, [updatedRegiments[0].power, 
                                                            updatedRegiments[0].morale, updatedRegiments[0].current_event_trigger, 
                                                            updatedRegiments[0].status, updatedRegiments[0].regiment_id]);

                        var regimentPromise1 = client.query(`WITH updated_regiment AS (
                                                                UPDATE regiment
                                                                SET power = $1, morale = $2, current_event_trigger = $3, status = $4
                                                                WHERE regiment_id = $5
                                                                RETURNING regiment.*
                                                            )
                                                            SELECT * FROM game
                                                            JOIN updated_regiment ON updated_regiment.game_id = game.game_id
                                                            LEFT JOIN event ON event.trigger = updated_regiment.current_event_trigger
                                                            LEFT JOIN message ON message.event_id = event.event_id;`, [updatedRegiments[1].power, 
                                                            updatedRegiments[1].morale, updatedRegiments[1].current_event_trigger, 
                                                            updatedRegiments[1].status, updatedRegiments[1].regiment_id]);

                        var regimentPromise2 = client.query(`WITH updated_regiment AS (
                                                                UPDATE regiment
                                                                SET power = $1, morale = $2, current_event_trigger = $3, status = $4
                                                                WHERE regiment_id = $5
                                                                RETURNING regiment.*
                                                            )
                                                            SELECT * FROM game
                                                            JOIN updated_regiment ON updated_regiment.game_id = game.game_id
                                                            LEFT JOIN event ON event.trigger = updated_regiment.current_event_trigger
                                                            LEFT JOIN message ON message.event_id = event.event_id;`, [updatedRegiments[2].power, 
                                                            updatedRegiments[2].morale, updatedRegiments[2].current_event_trigger, 
                                                            updatedRegiments[2].status, updatedRegiments[2].regiment_id]);

                        var regimentPromise3 = client.query(`WITH updated_regiment AS (
                                                                UPDATE regiment
                                                                SET power = $1, morale = $2, current_event_trigger = $3, status = $4
                                                                WHERE regiment_id = $5
                                                                RETURNING regiment.*
                                                            )
                                                            SELECT * FROM game
                                                            JOIN updated_regiment ON updated_regiment.game_id = game.game_id
                                                            LEFT JOIN event ON event.trigger = updated_regiment.current_event_trigger
                                                            LEFT JOIN message ON message.event_id = event.event_id;`, [updatedRegiments[3].power, 
                                                            updatedRegiments[3].morale, updatedRegiments[3].current_event_trigger, 
                                                            updatedRegiments[3].status, updatedRegiments[3].regiment_id]);

                        var regimentPromise4 = client.query(`WITH updated_regiment AS (
                                                                UPDATE regiment
                                                                SET power = $1, morale = $2, current_event_trigger = $3, status = $4
                                                                WHERE regiment_id = $5
                                                                RETURNING regiment.*
                                                            )
                                                            SELECT * FROM game
                                                            JOIN updated_regiment ON updated_regiment.game_id = game.game_id
                                                            LEFT JOIN event ON event.trigger = updated_regiment.current_event_trigger
                                                            LEFT JOIN message ON message.event_id = event.event_id;`, [updatedRegiments[4].power, 
                                                            updatedRegiments[4].morale, updatedRegiments[4].current_event_trigger, 
                                                            updatedRegiments[4].status, updatedRegiments[4].regiment_id]);

                        var regimentPromise5 = client.query(`WITH updated_regiment AS (
                                                                UPDATE regiment
                                                                SET power = $1, morale = $2, current_event_trigger = $3, status = $4
                                                                WHERE regiment_id = $5
                                                                RETURNING regiment.*
                                                            )
                                                            SELECT * FROM game
                                                            JOIN updated_regiment ON updated_regiment.game_id = game.game_id
                                                            LEFT JOIN event ON event.trigger = updated_regiment.current_event_trigger
                                                            LEFT JOIN message ON message.event_id = event.event_id;`, [updatedRegiments[5].power, 
                                                            updatedRegiments[5].morale, updatedRegiments[5].current_event_trigger, 
                                                            updatedRegiments[5].status, updatedRegiments[5].regiment_id]);

                        Promise.all([regimentPromise0, regimentPromise1, regimentPromise2, regimentPromise3, regimentPromise4, 
                            regimentPromise5]).then(function(resultOfAllPromises) {
                            done();
                            console.log('result', resultOfAllPromises);

                            res.send(resultOfAllPromises);
                        }).catch(function(err){
                            console.log('Promise.all did not work!', err);
                            res.sendStatus(500);
                        })
                    }
                });
            } else {
                done();
                res.sendStatus(500);
            }
        }
    }); // end regiment get request
}

function combat(regimentArray, decision) {
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

    if (decision) {
        if (decision.type === 'defending' || decision.type === 'attacking') {
            if (decision.front === 'left') {
                leftRegiment.status = decision.type;
            } else if (decision.front === 'center') {
                centerRegiment.status = decision.type;
            } else if (decision.front === 'right') {
                rightRegiment.status = decision.type;
            }
        }
    }

    var updatedRegiments = [];

    var clash = function(friendly, enemy) {
        if (friendly.status === 'attacking' || friendly.status === 'defending') {
            var friendlyDamageTaken = attackDamage(enemy.power) - attackDamage(friendly.power);
            if (friendlyDamageTaken < 0) {
                friendlyDamageTaken = 0;
            }
            if (friendly.status === 'attacking') {
                friendlyDamageTaken += dice(enemy.attack_dice_sides, enemy.number_of_attack_dice);
            } else {
                friendlyDamageTaken += dice(enemy.attack_dice_sides, enemy.number_of_attack_dice) - dice(friendly.defense_dice_sides, friendly.number_of_defense_dice);
            }
        
            var enemyDamageTaken = attackDamage(friendly.power) - attackDamage(enemy.power);
            if (enemyDamageTaken < 0) {
                enemyDamageTaken = 0;
            }
            if (friendly.status === 'attacking') {
                enemyDamageTaken += dice(friendly.attack_dice_sides, friendly.number_of_attack_dice);
            } else {
                enemyDamageTaken += defendingDamage(dice(friendly.attack_dice_sides, friendly.number_of_attack_dice));
            }

            if (decision) {
                if (decision.type === 'charge' && decision.front === friendly.front) {
                    enemyDamageTaken += decision.value;
                }
            }
            
            // if damage isn't negative, regiment take damamge to power and morale
            if (friendlyDamageTaken > 0) {
                friendly.power -= friendlyDamageTaken;
                friendly.morale -= friendlyDamageTaken;
            }
            if (enemyDamageTaken > 0) {
                enemy.power -= enemyDamageTaken;
                enemy.morale -= enemyDamageTaken;
            }
            
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

            var event = function(friendly, enemy) {
                if (friendly.power === 0 && enemy.power === 0) {
                    friendly.status = 'destroyed';
                    enemy.status = 'destroyed';
                    friendly.current_event_trigger = 'mutual destruction';
                } else if (friendly.power === 0) {
                    friendly.status = 'destroyed';
                    enemy.status = 'victorious';
                    friendly.current_event_trigger = 'friendly destruction';
                } else if (enemy.power === 0) {
                    friendly.status = 'victorious';
                    enemy.status = 'destroyed';
                    friendly_status = 'victorious';
                    friendly.current_event_trigger = 'enemy destruction';
                } else if (friendly.morale === 0 && enemy.morale === 0) {
                    friendly.status = 'broken';
                    enemy.status = 'broken';
                    friendly.current_event_trigger = 'mutual break';
                } else if (friendly.morale === 0) {
                    friendly.status = 'broken';
                    enemy.status = 'victorious';
                    friendly.current_event_trigger = 'friendly break';
                } else if (enemy.morale === 0) {
                    friendly.status = 'victorious';
                    enemy.status = 'broken';
                    friendly.current_event_trigger = 'enemy break';
                } else {
                    friendly.current_event_trigger = 'nothing';
                }
            }

            event(friendly, enemy);
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

function defendingDamage(damage) {
    return Math.floor(damage / 2);
}

function roundPlusOne(req, res) {
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
        console.log('error', errorConnectingToDatabase);
        res.sendStatus(500);
        } else {
            var userId = req.user.id;
            client.query(`WITH last_game AS (
                            SELECT game_id FROM game
                            WHERE user_id = $1
                            ORDER BY game_id DESC
                            LIMIT 1
                        )
                        UPDATE game
                        SET round = round + 1
                        FROM last_game
                        WHERE game.game_id = last_game.game_id;`, [userId]);
        }
    });
}

module.exports = router;