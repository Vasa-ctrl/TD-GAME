import { GameObject } from './GameObject.js';
import { Assets } from '../core/GameAssets.js';

export class Projectile extends GameObject {
  constructor(x, y, projType) {
    super(x, y);
    this.width = 16;
    this.height = 16;

    this.image = Assets.projectiles[projType];
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}
