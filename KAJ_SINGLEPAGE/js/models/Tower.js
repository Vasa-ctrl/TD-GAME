import { TowerStats } from '../config/GameAssets.js';
import { Projectile } from './Projectile.js';

/**
 * Represents a defensive tower in the game.
 */
export class Tower {
  /**
   * Creates a new Tower instance.
   * @param {string} type - The type of the tower (e.g., 'basic', 'sniper').
   * @param {number} x - The x-coordinate on the grid.
   * @param {number} y - The y-coordinate on the grid.
   * @param {AudioController} audio - The audio controller for playing sound effects.
   */
  constructor(type, x, y, audio) {
    /** @type {string} */
    this.type = type;
    /** @type {number} */
    this.x = x;
    /** @type {number} */
    this.y = y;
    /** @type {AudioController} */
    this.audio = audio;

    const stats = TowerStats[type];
    Object.assign(this, stats);

    /** @type {number} */
    this.range = stats.range / 100 * 3;
    /** @type {number} */
    this.fireRate = 90 / (stats.attackSpeed || 1);
    /** @type {number} */
    this.cooldown = 0;
    /** @type {number} */
    this.scale = 1.2;
  }

  /**
   * Updates the tower's state, handles cooldowns, and attempts to shoot.
   * @param {Array} enemies - List of active enemies.
   * @param {Array} projectiles - List of active projectiles to add to.
   * @param {number} gameSpeed - The current game speed multiplier.
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
   * Finds the furthest enemy within the tower's range.
   * @param {Array} enemies - List of active enemies.
   * @returns {Enemy|undefined} The target enemy or undefined if none in range.
   */
  findTarget(enemies) {
    return enemies
      .filter(e => Math.hypot(e.x - this.x, e.y - this.y) <= this.range)
      .sort((a, b) => b.distanceTraveled - a.distanceTraveled)[0];
  }

  /**
   * Fires a projectile at the specified target.
   * @param {Enemy} target - The enemy to shoot at.
   * @param {Array} projectiles - The array to push the new projectile into.
   */
  shoot(target, projectiles) {
    projectiles.push(new Projectile(this.x + 0.5, this.y + 0.5, target, this.damage, this.projectileImage));

    this.audio?.playSound(this.shootSound);
    this.scale = 1.5;
  }
}
