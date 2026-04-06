import { EnemyStats, assets } from '../config/GameAssets.js';

/**
 * Represents an enemy unit in the game.
 */
export class Enemy {
  /**
   * @param {string} type - The type of enemy (e.g., 'basic', 'fast').
   * @param {Array<{x: number, y: number}>} path - Array of waypoints for movement.
   */
  constructor(type, path) {
    this.type = type;
    this.path = path;

    const stats = EnemyStats[type];
    if (!stats) {
      console.error(`Enemy type '${type}' not found in EnemyStats!`);
      return;
    }

    this.hp = this.maxHp = stats.hp;
    this.speed = stats.speed * 0.02;
    this.reward = stats.reward;
    this.image = stats.image;
    this.bloodImage = assets.effects.bloodSplash;

    this.x = path[0].x;
    this.y = path[0].y;
    this.waypointIndex = 0;
    this.radius = 0.3;
    this.distanceTraveled = 0;
    this.markedForDeletion = false;
    this.isDying = false;
    this.deathTimer = 30;
    this.rewardClaimed = false;
    this.damageDealt = false;
  }

  /**
   * Updates the enemy's position or death state.
   * @param {number} gameSpeed - The multiplier for movement and timers.
   */
  update(gameSpeed) {
    if (this.isDying) {
      this.deathTimer -= gameSpeed;
      if (this.deathTimer <= 0) this.markedForDeletion = true;
      return;
    }

    if (this.waypointIndex >= this.path.length - 1) {
      this.markedForDeletion = true;
      return;
    }

    const target = this.path[this.waypointIndex + 1];
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const currentSpeed = this.speed * gameSpeed;

    if (distance < currentSpeed) {
      this.x = target.x;
      this.y = target.y;
      this.waypointIndex++;
    } else {
      this.x += (dx / distance) * currentSpeed;
      this.y += (dy / distance) * currentSpeed;
      this.distanceTraveled += currentSpeed;
    }
  }

  /**
   * Reduces enemy health and triggers death state if HP reaches zero.
   * @param {number} amount - The amount of damage to subtract.
   */
  takeDamage(amount) {
    if (this.isDying) return;
    this.hp -= amount;
    if (this.hp <= 0) {
      this.hp = 0;
      this.isDying = true;
    }
  }
}
