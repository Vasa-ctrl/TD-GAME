import { GameObject } from './GameObject.js';
import { Assets } from '../core/GameAssets.js';

export class Enemy extends GameObject {
  #hp;

  // Přidali jsme path (pole waypointů) a tileSize
  constructor(startX, startY, maxHP, speed, reward, enemyType, path, tileSize) {
    super(startX, startY);

    this.#hp = maxHP;
    this.speed = speed;
    this.isDead = false;
    this.reward = reward;

    // Pevná velikost (doplň podle svých obrázků)
    this.width = 64;
    this.height = 64;

    this.image = Assets.enemies[enemyType];

    // --- Logika cesty ---
    this.path = path;           // Zkopírujeme si pole bodů, např. [{x: 0, y: 1}, {x: 1, y: 1}, ...]
    this.tileSize = tileSize;
    this.pathIndex = 1;         // Začínáme mířit na druhý bod (na prvním se rodíme)
  }

  get hp() {
    return this.#hp;
  }

  takeDamage(damage) {
    this.#hp -= damage;
    if (this.#hp <= 0) {
      this.isDead = true;
    }
  }

  draw(ctx) {
    if (!this.isDead) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }

  // Metoda update je nyní UVNITŘ třídy
  update() {
    if (this.isDead) return;

    // Pokud jsme došli na konec cesty (nepřítel prošel mapou)
    if (this.pathIndex >= this.path.length) {
      this.isDead = true;
      console.log("Nepřítel prošel do základny! Tady bys měl odečíst životy.");
      return;
    }

    // 1. Zjistíme, kam zrovna jdeme (přepočet na přesné pixely plátna)
    const targetTile = this.path[this.pathIndex];
    const targetPixelX = targetTile.x * this.tileSize;
    const targetPixelY = targetTile.y * this.tileSize;

    // 2. Vypočítáme vzdálenosti na osách X a Y
    const dx = targetPixelX - this.x;
    const dy = targetPixelY - this.y;

    // 3. Spočítáme celkovou vzdálenost k cíli (Pythagorova věta)
    const distance = Math.sqrt(dx * dx + dy * dy);

    // 4. Pokud jsme už dostatečně blízko, přeskočíme rovnou na cíl a jdeme na další bod
    if (distance <= this.speed) {
      this.x = targetPixelX;
      this.y = targetPixelY;
      this.pathIndex++;
    } else {
      // 5. Jinak se plynule posuneme směrem k cíli pomocí normalizovaného vektoru
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
    }
  }
}
