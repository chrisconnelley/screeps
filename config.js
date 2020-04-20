/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('config');
 * mod.thing == 'a thing'; // true
 */

const ARE_TOWERS_ACTIVE = true;
const SHOULD_HEAL_CONTAINERS = true;
const SHOULD_REFUEL_TOWERS = true;

module.exports = {
    areTowersActive: ARE_TOWERS_ACTIVE,
    shouldRefuelTowers: SHOULD_REFUEL_TOWERS,
    shouldHealContainers: SHOULD_HEAL_CONTAINERS
};
