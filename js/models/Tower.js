import { TowerStats } from '../config/towersConfig.js';

export class Tower {
    /**
     * @param {string} type Typ věže (klíč z configu, např. 'ben').
     * @param {number} x X souřadnice v mřížce.
     * @param {number} y Y souřadnice v mřížce.
     */
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;

        // Načteme statistiky z konfigurace
        this.config = TowerStats[type];

        // Připravíme obrázek
        this.image = new Image();
        this.image.src = this.config.image;

        // Herní vlastnosti (zkopírujeme, abychom je mohli měnit, např. buffy)
        this.range = this.config.range;
        this.damage = this.config.damage;

        // Časování střelby
        this.lastShotTime = 0;
    }

    /**
     * Vykreslí věž na plátno.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} tileSize Velikost jedné dlaždice.
     */
    draw(ctx, tileSize) {
        // Vykreslíme obrázek věže na střed dlaždice
        if (this.image.complete) {
            ctx.drawImage(
                this.image,
                this.x * tileSize,
                this.y * tileSize,
                tileSize,
                tileSize
            );
          // ctx.beginPath();
          // // Střed kružnice je posunutý do středu dlaždice (+ tileSize / 2)
          // ctx.arc((this.x * tileSize) + (tileSize / 2), (this.y * tileSize) + (tileSize / 2), this.range, 0, Math.PI * 2);
          // ctx.strokeStyle = 'rgba(255, 255, 255)';
          // ctx.stroke();
        }
    }

  update(deltaTime, enemies, tileSize) {
    this.fireTimer += deltaTime;
    if (this.fireTimer >= this.fireRate) {
      // Tady budeme hledat nepřítele...

      // this.fireTimer = 0; // Vynulujeme stopky po výstřelu
    }    const target = this.findTarget(enemies, tileSize);
    if (target) {
      this.shoot(target);
      this.fireTimer = 0;
    }
  }

  /**
   * Najde nejbližšího nepřítele v dosahu.
   */
  findTarget(enemies, tileSize) {
    const centerX = this.x * tileSize + tileSize / 2;
    const centerY = this.y * tileSize + tileSize / 2;

    for (const enemy of enemies) {
      const dist = Math.hypot(enemy.x - centerX, enemy.y - centerY);
      if (dist <= this.range) {
        return enemy;
      }
    }
    return null;
  }

  /**
   * Logika výstřelu na cíl.
   */
  shoot(target) {
    target.takeDamage(this.damage);

  }
}
