
/**
 * @fileoverview Configuration file for enemy waves in the tower defense game.
 * Defines the sequence, composition, and timing of enemy spawns.
 */

/**
 * Array of wave configurations.
 * Each wave contains one or more groups of enemies.
 * @type {Array<{groups: Array<{type: string, count: number, interval: number}>}>}
 */
export const LevelWaves = [
  {
    /** Wave 1: Warm-up round (Easy start) */
    groups: [
      { type: 'goblinRider', count: 10, interval: 1000 }
    ]
  },
  {
    /** Wave 2: First swarm (Slightly faster pace) */
    groups: [
      { type: 'goblinRider', count: 15, interval: 800 }
    ]
  },
  {
    /** Wave 3: I am speed (Introduction of super-fast Voidlings) */
    groups: [
      { type: 'goblinRider', count: 10, interval: 1000 },
      { type: 'voidling', count: 5, interval: 600 }
    ]
  },
  {
    /** Wave 4: Heavyweight (Azog arrives with 200 HP) */
    groups: [
      { type: 'goblinRider', count: 15, interval: 600 },
      { type: 'azog', count: 2, interval: 2000 }
    ]
  },
  {
    /** Wave 5: Fast death (Test of your towers' fire rate) */
    groups: [
      { type: 'voidling', count: 30, interval: 400 }
    ]
  },
  {
    /** Wave 6: First Tank (Introduction of the Ogre with 450 HP) */
    groups: [
      { type: 'goblinRider', count: 15, interval: 500 },
      { type: 'ogre', count: 1, interval: 3000 }
    ]
  },
  {
    /** Wave 7: Desert Storm (Fast and quite durable Camel Riders) */
    groups: [
      { type: 'camelRider', count: 15, interval: 800 }
    ]
  },
  {
    /** Wave 8: Coordinated Attack (Combination of different speeds) */
    groups: [
      { type: 'azog', count: 5, interval: 1500 },
      { type: 'camelRider', count: 10, interval: 800 },
      { type: 'voidling', count: 10, interval: 400 }
    ]
  },
  {
    /** Wave 9: Vanguard of Hell (Stress test of anti-tank defense) */
    groups: [
      { type: 'ogre', count: 3, interval: 4000 },
      { type: 'azog', count: 15, interval: 1000 }
    ]
  },
  {
    /** Wave 10: BOSS FIGHT! */
    groups: [
      /** Extreme tank (3500 HP) */
      { type: 'lucifer', count: 1, interval: 5000 },
      /** Annoying swarm around the boss to soak up tower projectiles */
      { type: 'voidling', count: 25, interval: 300 }
    ]
  }
];
