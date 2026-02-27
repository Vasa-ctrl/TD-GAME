import { TowerStats } from '../config/GameAssets.js';
import { Projectile } from './Projectile.js';

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

    // OPRAVA: Už nevytváříme "new Image()". Bereme rovnou hotový objekt!
    this.image = this.config.image;
    this.projectileImage = this.config.projectileImage;

    // Herní vlastnosti
    this.range = this.config.range / 100 * 3; // Přepočet range na dlaždice (cca)
    this.damage = this.config.damage;
    this.fireRate = this.config.fireRate || 60; // Počet snímků mezi výstřely (cca 1 sekunda)

    // Časování střelby
    this.cooldown = 0;

    // Animace
    this.scale = 1.0;
  }


  /**
   * Aktualizuje stav věže (hledání cíle, střelba).
   * @param {Array} enemies Seznam všech nepřátel.
   * @param {Array} projectiles Seznam všech střel (pro přidání nové).
   * @param {number} gameSpeed Rychlost hry.
   */
  update(enemies, projectiles, gameSpeed) {
    // Animace návratu do původní velikosti
    if (this.scale > 1.0) {
      this.scale -= 0.01 * gameSpeed;
      if (this.scale < 1.0) this.scale = 1.0;
    }

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
   * Najde nejvhodnější cíl (nejpřednější nepřítel v dosahu).
   * @param {Array} enemies
   * @returns {Enemy|null}
   */
  findTarget(enemies) {
    let bestTarget = null;
    let maxDistance = -1;

    for (const enemy of enemies) {
      // Vypočítáme vzdálenost k nepříteli (v dlaždicích)
      const dx = enemy.x - this.x;
      const dy = enemy.y - this.y;
      const distanceToEnemy = Math.sqrt(dx * dx + dy * dy);

      // Pokud je v dosahu
      if (distanceToEnemy <= this.range) {
        // A je "více vpředu" než aktuální nejlepší cíl
        if (enemy.distanceTraveled > maxDistance) {
          maxDistance = enemy.distanceTraveled;
          bestTarget = enemy;
        }
      }
    }
    return bestTarget;
  }

  shoot(target, projectiles) {
    // OPRAVA: Předáváme this.projectileImage (objekt) místo textové cesty
    projectiles.push(new Projectile(this.x + 0.5, this.y + 0.5, target, this.damage, this.projectileImage));

    // Spustíme animaci "kopnutí" (zvětšení)
    this.scale = 1.2;
  }

  /**
   * Vykreslí věž na plátno.
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} tileSize Velikost jedné dlaždice.
   */
  draw(ctx, tileSize) {
    // OPRAVA: Přidána pojistka, že image není undefined
    if (this.image && this.image.complete) {
      const centerX = this.x * tileSize + tileSize / 2;
      const centerY = this.y * tileSize + tileSize / 2;

      // Aplikujeme měřítko (scale)
      const currentSize = tileSize * this.scale;
      const offset = currentSize / 2;

      ctx.save(); // Uložíme kontext

      // Efekt obtažení (záře)
      ctx.shadowColor = "#7F00FF"; // Fialová záře
      ctx.shadowBlur = 10;

      // Pokud je zvětšená (střílí), uděláme záři silnější a tyrkysovou
      if (this.scale > 1.0) {
        ctx.shadowColor = "#00FFE1";
        ctx.shadowBlur = 30;
      }

      // Vykreslíme obrázek vycentrovaný a se správnou velikostí
      ctx.drawImage(
        this.image,
        centerX - offset,
        centerY - offset,
        currentSize,
        currentSize
      );

      ctx.restore(); // Obnovíme kontext (zrušíme stín pro další vykreslování)
    }

    const centerX = this.x * tileSize + tileSize / 2;
    const centerY = this.y * tileSize + tileSize / 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, this.range * tileSize, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 255, 225, 0.1)"; // Průhledná tyrkysová výplň
    ctx.fill();
    ctx.strokeStyle = "rgba(0, 255, 225, 0.5)"; // Výraznější okraj
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
  }
}
