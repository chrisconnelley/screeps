const ARE_TOWERS_ACTIVE = true;
const SHOULD_HEAL_CONTAINERS = true;
const SHOULD_REFUEL_TOWERS = true;

module.exports = {
    areTowersActive: ARE_TOWERS_ACTIVE,
    shouldRefuelTowers: SHOULD_REFUEL_TOWERS,
    shouldHealContainers: SHOULD_HEAL_CONTAINERS,
    lengthTickLengthStored: 99,
    roomEnergyCapacityDesired: [
      0, // RCL 0
      (300 * 1), // RCL 1
      (300 * 1) + (5 * 50), // RCL 2
      (300 * 1) + (10 * 50), // RCL 3
      (300 * 1) + (20 * 50), // RCL 4
      (300 * 1) + (30 * 50), // RCL 5
      (300 * 1) + (40 * 50), // RCL 6
      (300 * 2) + (50 * 100), // RCL 7
      (300 * 3) + (60 * 200) // RCL 8
    ]
};
