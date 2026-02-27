import { EnemyStats, assets } from '../config/GameAssets.js'; // Zkontroluj správnost cesty

export class Enemy {
  constructor(type, path) {
    this.type = type;
    this.path = path;

    // Načteme statistiky z konfigurace
    const stats = EnemyStats[type];

    // Pokud typ neexistuje v konfiguraci, raději vypíšeme chybu
    if (!stats) {
      console.error(`Enemy type '${type}' not found in EnemyStats!`);
      return;
    }

    this.hp = stats.hp;
    this.maxHp = stats.hp;
    this.speed = stats.speed * 0.02; // Zpomalíme pro herní měřítko
    this.reward = stats.reward;

    // OPRAVA: Bereme obrázek přímo ze statistik (už je to načtený Image objekt)
    this.image = stats.image;

    // OPRAVA: Správná cesta pro bloodSplash z objektu assets
    this.bloodImage = assets.effects.bloodSplash;

    // Pozice (začínáme na prvním bodu cesty)
    this.x = path[0].x;
    this.y = path[0].y;

    this.waypointIndex = 0;
    this.radius = 0.3; // Poloměr v dlaždicích
    this.distanceTraveled = 0;
    this.markedForDeletion = false;

    // Stav umírání
    this.isDying = false;
    this.deathTimer = 30; // Jak dlouho bude vidět krev (snímků)
    this.rewardClaimed = false; // Zda už byla vyplacena odměna
  }

  update(gameSpeed) {
    // Pokud umírá, jen počítáme čas do smazání
    if (this.isDying) {
      this.deathTimer -= gameSpeed;
      if (this.deathTimer <= 0) {
        this.markedForDeletion = true;
      }
      return; // Už se nehýbe
    }

    // Pokud jsme na konci cesty
    if (this.waypointIndex >= this.path.length - 1) {
      this.markedForDeletion = true;
      return; // Došli jsme do cíle
    }

    const target = this.path[this.waypointIndex + 1];
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Aktuální rychlost ovlivněná zrychlením hry
    const currentSpeed = this.speed * gameSpeed;

    // Pokud jsme blízko dalšího bodu, přepneme na něj
    if (distance < currentSpeed) {
      this.x = target.x;
      this.y = target.y;
      this.waypointIndex++;
    } else {
      // Jinak se posuneme k němu
      this.x += (dx / distance) * currentSpeed;
      this.y += (dy / distance) * currentSpeed;
      this.distanceTraveled += currentSpeed;
    }
  }

  draw(ctx, tileSize) {
    // Pokud umírá, kreslíme krev
    if (this.isDying) {
      // Zkontrolujeme, zda je obrázek načtený a platný
      if (this.bloodImage && this.bloodImage.complete) {
        const size = tileSize;
        const offset = (tileSize - size) / 2;

        ctx.save();
        ctx.globalAlpha = Math.max(0, this.deathTimer / 30); // Fade out efekt
        ctx.drawImage(
          this.bloodImage,
          this.x * tileSize + offset,
          this.y * tileSize + offset,
          size,
          size
        );
        ctx.restore();
      }
      return; // Nekreslíme už nepřítele ani health bar
    }

    // Kreslení nepřítele
    if (this.image && this.image.complete) {
      const size = tileSize * 0.8;
      const offset = (tileSize - size) / 2;

      // Kreslíme jen pokud je v rámci plátna (optimalizace a prevence chyb)
      ctx.drawImage(
        this.image,
        this.x * tileSize + offset,
        this.y * tileSize + offset,
        size,
        size
      );
    }

    // Health bar
    const hpPercentage = this.hp / this.maxHp;
    const barWidth = tileSize * 0.8;
    const barX = this.x * tileSize + (tileSize - barWidth) / 2;

    ctx.fillStyle = 'red';
    ctx.fillRect(barX, this.y * tileSize - 5, barWidth, 4);

    ctx.fillStyle = 'green';
    ctx.fillRect(barX, this.y * tileSize - 5, barWidth * Math.max(0, hpPercentage), 4); // Prevence záporné šířky
  }

  takeDamage(amount) {
    if (this.isDying) return; // Už je mrtvý

    this.hp -= amount;
    if (this.hp <= 0) {
      this.hp = 0;
      this.isDying = true; // Spustíme animaci smrti
    }
  }
}
