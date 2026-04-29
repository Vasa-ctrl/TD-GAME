/**
 * @file Tower.js
 * @description Defines the Tower class, representing defensive structures in the game.
 * Handles targeting logic, firing projectiles, and cooldown management.
 */

import { TowerStats } from '../config/GameAssets.js';
import { Projectile } from './Projectile.js';

/**
 * Represents a defensive tower placed on the game grid.
 * Responsible for scanning for enemies, calculating firing cooldowns,
 * and spawning projectiles when a target is within range.
 */
export class Tower {
  /**
   * Initializes a new Tower instance based on predefined statistics.
   * * @param {string} type - The specific identifier/type of the tower (e.g., 'Viking', 'Ninja').
   * @param {number} x - The x-coordinate on the map grid where the tower is placed.
   * @param {number} y - The y-coordinate on the map grid where the tower is placed.
   * @param {Object} audio - The AudioControl instance for dispatching sound effects.
   */
  constructor(type, x, y, audio) {
    /** @type {string} */
    this.type = type;
    /** @type {number} */
    this.x = x;
    /** @type {number} */
    this.y = y;
    /** @type {Object} */
    this.audio = audio;

    const stats = TowerStats[type];
    Object.assign(this, stats);

    /** * @type {number}
     * Adjust the base range to fit the grid coordinate system.
     */
    this.range = stats.range / 100 * 3;

    /** * @type {number}
     * Calculate frames required between shots based on attack speed.
     */
    this.fireRate = 90 / (stats.attackSpeed || 1);

    /** @type {number} Current cooldown timer before the tower can fire again. */
    this.cooldown = 0;

    /** @type {number} Visual scaling factor used for the firing animation ("recoil/pump"). */
    this.scale = 1.2;
  }

  /**
   * Called during the main game loop to update the tower's state.
   * Handles visual recoil recovery, cooldown countdown, and initiates shooting
   * if a valid target is found and the tower is ready.
   * * @param {Array<Object>} enemies - The active list of enemies currently on the map.
   * @param {Array<Object>} projectiles - The active list of projectiles to append new shots to.
   * @param {number} gameSpeed - The current game speed multiplier (e.g., 1 or 2).
   * @returns {void}
   */
  update(enemies, projectiles, gameSpeed) {
    this.scale = Math.max(1.2, this.scale - 0.01 * gameSpeed);

    if (this.cooldown > 0) {
      this.cooldown -= gameSpeed;
      return;
    }

    const target = this.findTarget(enemies);
    if (target) {
      this.shoot(target, projectiles);
      this.cooldown = this.fireRate;
    }
  }

  /**
   * Scans the provided list of enemies and finds the most optimal target.
   * The current targeting strategy selects the enemy closest to the end of the path
   * (highest distanceTraveled) that is within the tower's attack range.
   * * @param {Array<Object>} enemies - The active list of enemies to evaluate.
   * @returns {Object|undefined} The selected enemy object, or undefined if no enemies are in range.
   */
  findTarget(enemies) {
    return enemies
      .filter(e => Math.hypot(e.x - this.x, e.y - this.y) <= this.range)
      .sort((a, b) => b.distanceTraveled - a.distanceTraveled)[0];
  }

  /**
   * Executes the firing sequence.
   * Spawns a new projectile targeting the acquired enemy, plays the associated
   * sound effect, and triggers the visual firing animation.
   * * @param {Object} target - The enemy object to shoot at.
   * @param {Array<Object>} projectiles - The global array to push the newly created Projectile into.
   * @returns {void}
   */
  shoot(target, projectiles) {
    projectiles.push(
      new Projectile(this.x + 0.5, this.y + 0.5, target, this.damage, this.projectileImage)
    );

    this.audio?.playSound(this.shootSound);

    this.scale = 1.5;
  }
}
