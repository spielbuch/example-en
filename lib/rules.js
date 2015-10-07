/**
 * We create rules that we will use later on multiple occasions.
 * Since the rules are used on the server and the client , it must be in the / lib directory .
 * Moreover, they are global (hence declaration without var ) .
 */
Rules = {};
/**
 * A rule consists of a key and a value.
 * If the value is a string with a + or - it manipulates the absolute value.
 * If it is a number, it overrides the absolute value. The last absolute rule always wins.
 *
 * E.g
 * 15
 * '+5'
 * '-4'
 * '3'
 * = 19
 *
 * 15
 * '+3'
 * '-16'
 * 12 //overrides all previous values
 * = 12
 *
 */

/**
 * The names of damage, armor and hitpoints are defined in the Spielebuch.Gameplay-object.
 * you can check the setting in /lib/config.js.
 *
 *
 * By the way: the key of a value can be chosen freely,
 * Rules.brave = new Spielebuch.Rule('Brave', 20);
 *
 * This value can be queried in-game:
 * var braveness = player.getValueByName('Brave');
 * if(bravebess<30){
 *  //player runs away
 * }
 *
 * Vollkommene Freiheit... just saying ;)
 */


/**
 *  This rules are absolute, they are the value of a certain key.
 */
Rules.wooden = new Spielebuch.Rule(Spielebuch.Gameplay.hitpoints, 60);
Rules.humanHealth = new Spielebuch.Rule(Spielebuch.Gameplay.hitpoints, 80);
Rules.humanFistDamage = new Spielebuch.Rule(Spielebuch.Gameplay.damage, 20);
/**
 *  This rules manipulates the resulting value.
 */
Rules.iron = new Spielebuch.Rule(Spielebuch.Gameplay.hitpoints, '+5');
Rules.lowerHP = new Spielebuch.Rule(Spielebuch.Gameplay.hitpoints, '-15');
Rules.lowDamage = new Spielebuch.Rule(Spielebuch.Gameplay.damage, '+10');
Rules.swordDamage = new Spielebuch.Rule(Spielebuch.Gameplay.damage, '+60');
Rules.deathly = new Spielebuch.Rule(Spielebuch.Gameplay.hitpoints, 0); //this sets health to zero aka. kills everything

Rules.shieldDefense = new Spielebuch.Rule(Spielebuch.Gameplay.defense, '+20');

/**
 * We create two additional  rules :
 * First that the player starts with no money
 * And secondly , a rule that the player can earn money with the ax (by chopping wood).
 */
Rules.noMoney = new Spielebuch.Rule('Money', 0);
Rules.woodMoney = new Spielebuch.Rule('Money for wood',1);