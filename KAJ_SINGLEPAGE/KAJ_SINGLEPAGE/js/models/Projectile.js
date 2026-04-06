/**
 * Represents a projectile fired by a tower towards an enemy target.
 */
export class Projectile {
  /**
   * @param {number} x - Initial X coordinate.
   * @param {number} y - Initial Y coordinate.
   * @param {Object} target - The enemy object to track.
   * @param {number} damage - Damage to deal on impact.
   * @param {HTMLImageElement} image - Image to render.
   * @param {number} [speed=5] - Movement speed multiplier.
   */
  constructor(x, y, target, damage, image, speed = 5) {
    this.x = x;
    this.y = y;
    this.target = target;
    this.damage = damage;
    this.speed = speed * 0.015;
    this.radius = 0.2;
    this.markedForDeletion = false;
    this.image = image;
  }

  /**
   * Updates the projectile's position towards the target and checks for collision.
   * @param {number} gameSpeed - The current game speed multiplier.
   */
  update(gameSpeed) {
    if (!this.target || this.target.hp <= 0) {
      this.markedForDeletion = true;
      return;
    }

    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const currentSpeed = this.speed * gameSpeed;

    if (distance < currentSpeed + this.target.radius) {
      this.target.takeDamage(this.damage);
      this.markedForDeletion = true;
      return;
    }

    const velocityX = (dx / distance) * currentSpeed;
    const velocityY = (dy / distance) * currentSpeed;

    this.x += velocityX;
    this.y += velocityY;
  }
}
